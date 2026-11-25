import { describe, it, expect, vi, beforeEach } from 'vitest';
import Stripe from 'stripe';
import type { FeatureContext } from '../../../src/platform/module-api';

const repo = vi.hoisted(() => ({
  findByExternalSessionId: vi.fn(),
  updatePayment: vi.fn(),
  createTransaction: vi.fn(),
}));
const audit = vi.hoisted(() => ({ log: vi.fn() }));

vi.mock('../repositories/paymentRepository', () => ({ paymentRepository: repo }));
vi.mock('../repositories/paymentAuditRepository', () => ({ paymentAuditRepository: audit }));
vi.mock('../services/EncryptionService', () => ({ decryptSecret: (v: string) => v }));

import { StripeProvider, STRIPE_API_VERSION } from './StripeProvider';

const WEBHOOK_SECRET = 'whsec_test_secret';
const stripeConfig = {
  enabled: true,
  secretKey: 'sk_test_x',
  publishableKey: 'pk_test_x',
  webhookSecret: WEBHOOK_SECRET,
  sandbox: true,
};
const context = {
  getConfig: async () => ({ stripe: stripeConfig }),
} as unknown as FeatureContext;

const dbRow = {
  id: 'pay_internal_1',
  amount_cents: 1250,
  currency: 'EUR',
  resource_type: 'order',
  resource_id: 'order_1',
};

function signedEvent(type: string, session: Partial<Stripe.Checkout.Session>) {
  const payload = JSON.stringify({
    id: `evt_${type}`,
    object: 'event',
    api_version: STRIPE_API_VERSION,
    type,
    data: { object: { id: 'cs_test_1', object: 'checkout.session', ...session } },
  });
  const header = Stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  return { body: Buffer.from(payload), headers: { 'stripe-signature': header } };
}

describe('StripeProvider webhooks (stripe-node 23)', () => {
  const provider = new StripeProvider();

  beforeEach(() => {
    vi.clearAllMocks();
    repo.findByExternalSessionId.mockResolvedValue(dbRow);
  });

  it('rejects payloads with an invalid signature', async () => {
    const { body } = signedEvent('checkout.session.completed', { payment_status: 'paid' });
    const result = await provider.handleWebhook(context, body, { 'stripe-signature': 't=1,v1=deadbeef' });
    expect(result.success).toBe(false);
    expect(repo.updatePayment).not.toHaveBeenCalled();
  });

  it('completes a paid card checkout', async () => {
    const { body, headers } = signedEvent('checkout.session.completed', {
      payment_status: 'paid',
      payment_intent: 'pi_test_1',
    });
    const result = await provider.handleWebhook(context, body, headers);
    expect(result).toMatchObject({
      success: true,
      outcome: 'completed',
      sessionId: dbRow.id,
      transactionId: 'pi_test_1',
      resourceId: 'order_1',
    });
    expect(repo.createTransaction).toHaveBeenCalledOnce();
  });

  it('does not release an order when checkout completes without payment (async method)', async () => {
    const { body, headers } = signedEvent('checkout.session.completed', {
      payment_status: 'unpaid',
      payment_intent: 'pi_test_2',
    });
    const result = await provider.handleWebhook(context, body, headers);
    expect(result.success).toBe(true);
    expect(result.outcome).toBeUndefined();
    expect(result.sessionId).toBe('');
    expect(repo.updatePayment).not.toHaveBeenCalled();
    expect(repo.createTransaction).not.toHaveBeenCalled();
  });

  it('completes once a delayed payment succeeds', async () => {
    const { body, headers } = signedEvent('checkout.session.async_payment_succeeded', {
      payment_status: 'paid',
      payment_intent: 'pi_test_2',
    });
    const result = await provider.handleWebhook(context, body, headers);
    expect(result.outcome).toBe('completed');
  });

  it('marks a failed delayed payment as failed', async () => {
    const { body, headers } = signedEvent('checkout.session.async_payment_failed', {
      payment_status: 'unpaid',
    });
    const result = await provider.handleWebhook(context, body, headers);
    expect(result.outcome).toBe('failed');
    expect(repo.updatePayment).toHaveBeenCalledWith(dbRow.id, {
      status: 'failed',
      paymentStatus: 'PAYMENT_FAILED',
    });
  });

  it('marks an expired checkout as timeout', async () => {
    const { body, headers } = signedEvent('checkout.session.expired', { payment_status: 'unpaid' });
    const result = await provider.handleWebhook(context, body, headers);
    expect(result.outcome).toBe('timeout');
    expect(repo.updatePayment).toHaveBeenCalledWith(dbRow.id, {
      status: 'cancelled',
      paymentStatus: 'PAYMENT_TIMEOUT',
    });
  });
});
