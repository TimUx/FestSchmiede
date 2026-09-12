import { describe, it, expect } from 'vitest';
import { notificationsConfigSchema, defaultNotificationConfig, mergeNotificationConfig } from '../config';

describe('notifications module QA', () => {
  it('default config validates', () => {
    expect(notificationsConfigSchema.parse(defaultNotificationConfig)).toBeDefined();
  });

  it('merges legacy configs without smtp branding', () => {
    const merged = mergeNotificationConfig({
      events: defaultNotificationConfig.events,
      branding: defaultNotificationConfig.branding,
    });
    expect(merged.smtp).toEqual(defaultNotificationConfig.smtp);
  });

  it('prefaults nested event and branding defaults for empty input', () => {
    const parsed = notificationsConfigSchema.parse({});
    expect(parsed.events.orderCreated.email).toBe(true);
    expect(parsed.branding.primaryColor).toBe('#1976d2');
  });
});
