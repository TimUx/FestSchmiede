import { describe, it, expect } from 'vitest';
import { printerConfigSchema, defaultPrinterConfig } from '../config';

describe('printer module QA', () => {
  it('default config validates', () => {
    expect(printerConfigSchema.parse(defaultPrinterConfig)).toBeDefined();
  });

  it('prefaults auto-print and discovery defaults for empty input', () => {
    const parsed = printerConfigSchema.parse({});
    expect(parsed.autoPrint.kitchenOnOrderCreated).toBe(true);
    expect(parsed.discovery.port).toBe(9100);
  });
});
