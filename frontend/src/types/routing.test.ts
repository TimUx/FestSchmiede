import { describe, it, expect } from 'vitest';
import { DEFAULT_ROUTING } from '@/types/routing';

describe('routing types', () => {
  it('provides safe defaults', () => {
    expect(DEFAULT_ROUTING.scope).toBe('tenant');
    expect(DEFAULT_ROUTING.basename).toBe('');
    expect(DEFAULT_ROUTING.platformUrl).toContain('festmanager');
  });
});
