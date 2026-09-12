import { describe, it, expect } from 'vitest';
import { setupCompleteSchema, setupStepSchema, submitTenantApplicationSchema } from './schemas';

const validBase = {
  organization: 'Test Verein',
  organizationType: 'Verein',
  contactName: 'Max Mustermann',
  street: 'Hauptstr 1',
  postalCode: '12345',
  city: 'Musterstadt',
  email: 'test@example.com',
  reason: 'Wir brauchen FestSchmiede für unser Sommerfest mit vielen Gästen.',
  desiredFeatures: 'Online-Bestellung und Küchenmonitor',
  freeTierJustification: 'Wir sind ein kleiner gemeinnütziger Verein ohne Budget.',
  plannedUsage: 'Einmal jährlich beim Sommerfest',
  requestedSubdomain: 'test-verein',
  privacyAccepted: true,
  termsAccepted: true,
  formStartedAt: Date.now() - 5000,
};

describe('submitTenantApplicationSchema', () => {
  it('accepts bare website domains by adding https', () => {
    const result = submitTenantApplicationSchema.parse({
      ...validBase,
      website: 'www.mein-verein.de',
    });
    expect(result.website).toBe('https://www.mein-verein.de');
  });

  it('normalizes requested subdomain before validation', () => {
    const result = submitTenantApplicationSchema.parse({
      ...validBase,
      requestedSubdomain: 'Mein Verein',
    });
    expect(result.requestedSubdomain).toBe('mein-verein');
  });

  it('truncates decimal member counts to integers', () => {
    const result = submitTenantApplicationSchema.parse({
      ...validBase,
      memberCount: 12.8,
    });
    expect(result.memberCount).toBe(12);
  });

  it('uses explicit error messages for required consent flags', () => {
    const result = submitTenantApplicationSchema.safeParse({
      ...validBase,
      privacyAccepted: false,
      termsAccepted: false,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        'Datenschutzerklärung muss akzeptiert werden',
        'Nutzungsbedingungen müssen akzeptiert werden',
      ])
    );
  });
});

describe('setup schemas', () => {
  it('accepts arbitrary object payloads with string keys', () => {
    expect(
      setupStepSchema.parse({
        step: 2,
        data: { slug: 'mein-verein', nested: { enabled: true } },
      }).data
    ).toEqual({ slug: 'mein-verein', nested: { enabled: true } });

    expect(
      setupCompleteSchema.parse({
        data: { adminEmail: 'admin@example.com' },
      }).data
    ).toEqual({ adminEmail: 'admin@example.com' });
  });
});
