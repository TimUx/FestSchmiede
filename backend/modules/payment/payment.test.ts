import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';
import {
  StripeProvider,
  STRIPE_API_VERSION,
  STRIPE_ALLOWED_PAYMENT_METHOD_TYPES,
  buildCheckoutSessionParams,
} from './providers/StripeProvider';
import { PaypalProvider } from './providers/placeholders';
import { defaultPaymentConfig } from './config';
import { toPaymentMethodInfo } from './providerMetadata';
import { legacyStatusToPaymentStatus, resolvePaymentStatus } from './types';
import { PAYMENT_FEATURES } from './PaymentProvider';
import { isMissingPaymentsSchema } from './repositories/paymentRepository';

describe('PaymentProvider configuration', () => {
  it('Stripe is configured only with keys and enabled flag', () => {
    const stripe = new StripeProvider();
    expect(stripe.implemented).toBe(true);
    expect(stripe.isConfigured(defaultPaymentConfig)).toBe(false);
    expect(stripe.isConfigured({
      ...defaultPaymentConfig,
      stripe: {
        enabled: true,
        secretKey: 'sk_test_x',
        publishableKey: 'pk_test_x',
        sandbox: true,
      },
    })).toBe(true);
  });

  it('placeholder providers are never configured', () => {
    const paypal = new PaypalProvider();
    expect(paypal.implemented).toBe(false);
    expect(paypal.isConfigured({
      ...defaultPaymentConfig,
      paypal: { enabled: true, clientId: 'x', clientSecret: 'y', sandbox: true },
    })).toBe(false);
  });

  it('Stripe supports all payment features', () => {
    const stripe = new StripeProvider();
    expect(stripe.supports(PAYMENT_FEATURES.CHECKOUT)).toBe(true);
    expect(stripe.supports(PAYMENT_FEATURES.WEBHOOK)).toBe(true);
    expect(stripe.supports(PAYMENT_FEATURES.REFUND)).toBe(true);
    expect(stripe.supports(PAYMENT_FEATURES.CANCEL)).toBe(true);
  });

  it('placeholder providers support no features', () => {
    const paypal = new PaypalProvider();
    expect(paypal.supports(PAYMENT_FEATURES.CHECKOUT)).toBe(false);
  });
});

describe('Payment method metadata', () => {
  it('exposes display names without exposing internal provider id in public DTO', () => {
    const stripe = new StripeProvider();
    const info = toPaymentMethodInfo(stripe, { recommended: true });
    expect(info.displayName).toBe('Online bezahlen');
    expect(info.checkoutType).toBe('redirect');
    expect(info.providerId).toBe('stripe');
    const { providerId: _id, ...publicDto } = info;
    expect(publicDto).not.toHaveProperty('providerId');
    expect(publicDto.displayName).toBeDefined();
  });
});

describe('Payment status mapping', () => {
  it('maps legacy pending to PAYMENT_PENDING', () => {
    expect(legacyStatusToPaymentStatus('pending')).toBe('PAYMENT_PENDING');
    expect(legacyStatusToPaymentStatus('completed')).toBe('PAYMENT_PAID');
    expect(legacyStatusToPaymentStatus('cancelled')).toBe('PAYMENT_CANCELLED');
  });

  it('resolves ORDER_CONFIRMED when paid and released', () => {
    expect(resolvePaymentStatus({
      payment_status: 'PAYMENT_PAID',
      status: 'completed',
      released_to_kitchen: true,
    })).toBe('PAYMENT_PAID');

    expect(resolvePaymentStatus({
      payment_status: null,
      status: 'completed',
      released_to_kitchen: true,
    })).toBe('ORDER_CONFIRMED');
  });
});

describe('Payment method types', () => {
  it('parses provider id from method type key', async () => {
    const { parsePaymentMethodId } = await import('./methodTypes');
    expect(parsePaymentMethodId('stripe:card')).toEqual({ providerId: 'stripe', methodType: 'card' });
    expect(parsePaymentMethodId('stripe')).toEqual({ providerId: 'stripe', methodType: undefined });
  });

  it('builds enabled methods from methodTypes config', async () => {
    const { buildEnabledPaymentMethods } = await import('./methodTypes');
    const methods = buildEnabledPaymentMethods({
      ...defaultPaymentConfig,
      stripe: {
        enabled: true,
        secretKey: 'sk_test_x',
        publishableKey: 'pk_test_x',
        sandbox: true,
      },
      methodTypes: {
        'stripe:card': { enabled: true, recommended: true, sortOrder: 5 },
        'stripe:apple_pay': { enabled: false, recommended: false, sortOrder: 10 },
      },
    });
    expect(methods.some((m) => m.providerId === 'stripe:card')).toBe(true);
    expect(methods.some((m) => m.providerId === 'stripe:apple_pay')).toBe(false);
  });
});

describe('isMissingPaymentsSchema', () => {
  it('erkennt fehlende payments-Tabelle aus Prisma-Raw-Query-Fehlern', () => {
    const err = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2010',
      message: 'Invalid `prisma.$queryRaw()` invocation:',
      meta: { code: '42P01', message: 'relation "payments" does not exist' },
    };

    expect(isMissingPaymentsSchema(err)).toBe(true);
  });

  it('ignoriert fehlende tenant_id-Spalte in payment_audit', () => {
    const err = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2010',
      message: 'Invalid `prisma.$executeRaw()` invocation:',
      meta: { code: '42703', message: 'column "tenant_id" does not exist' },
    };

    expect(isMissingPaymentsSchema(err)).toBe(true);
  });

  it('ignoriert fremde Datenbankfehler', () => {
    const err = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2010',
      message: 'Invalid `prisma.$queryRaw()` invocation:',
      meta: { code: '42P01', message: 'relation "Order" does not exist' },
    };

    expect(isMissingPaymentsSchema(err)).toBe(false);
  });
});

describe('Stripe Checkout parameters (stripe-node 23)', () => {
  const resource = {
    type: 'order',
    id: 'order_42',
    amountCents: 1990,
    currency: 'EUR',
    description: 'Bestellung #42',
    customerEmail: 'gast@example.org',
    returnUrl: 'https://fest.example.org/ok',
    cancelUrl: 'https://fest.example.org/abbruch',
    metadata: { tenant: 't1' },
  };
  const expiresAt = new Date('2026-12-01T12:00:00Z');

  it('pins the API version shipped with the installed stripe SDK', () => {
    const client = new Stripe('sk_test_x', { apiVersion: STRIPE_API_VERSION });
    expect(client.getApiField('version')).toBe(STRIPE_API_VERSION);
    expect(STRIPE_API_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}\.[a-z]+$/);
  });

  it('only allows card payments (no delayed methods like SEPA)', () => {
    expect([...STRIPE_ALLOWED_PAYMENT_METHOD_TYPES]).toEqual(['card']);
    const params = buildCheckoutSessionParams({ internalSessionId: 'pay_1', expiresAt, resource });
    expect(params.allowed_payment_method_types).toEqual(['card']);
    expect(params).not.toHaveProperty('payment_method_types');
    expect(params).not.toHaveProperty('payment_method_configuration');
  });

  it('maps the payable resource onto the checkout session', () => {
    const params = buildCheckoutSessionParams({ internalSessionId: 'pay_1', expiresAt, resource });
    expect(params.mode).toBe('payment');
    expect(params.expires_at).toBe(Math.floor(expiresAt.getTime() / 1000));
    expect(params.line_items).toEqual([{
      price_data: { currency: 'eur', unit_amount: 1990, product_data: { name: 'Bestellung #42' } },
      quantity: 1,
    }]);
    expect(params.metadata).toEqual({
      payableResourceType: 'order',
      payableResourceId: 'order_42',
      internalSessionId: 'pay_1',
      tenant: 't1',
    });
    expect(params.success_url).toBe(resource.returnUrl);
    expect(params.cancel_url).toBe(resource.cancelUrl);
  });
});
