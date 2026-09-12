import { describe, it, expect, beforeAll } from 'vitest';
import { createTestApp, hasDb, tenantApi } from './setup';
import type { Express } from 'express';

describe('API /public/health', () => {
  let app: Express;

  beforeAll(async () => {
    if (!hasDb) return;
    app = await createTestApp();
  });

  it.skipIf(!hasDb)('returns tenant or platform scope', async () => {
    const res = await tenantApi(app).get('/api/public/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(['tenant', 'platform']).toContain(res.body.scope);
    expect(res.body.timestamp).toBeDefined();
  });
});
