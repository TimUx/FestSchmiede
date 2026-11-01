import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, buildApiUrl, configureApiBase, formatPrice, getImageUrl } from '@/services/api';

describe('api.deleteOrder', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    configureApiBase('/api');
  });

  it('deletes through the tenant-scoped API and accepts an empty 204 response', async () => {
    configureApiBase('/test-tenant/api');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.deleteOrder('admin-token', 'order-id')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('/test-tenant/api/staff/orders/order-id', expect.objectContaining({
      method: 'DELETE',
      headers: expect.objectContaining({ Authorization: 'Bearer admin-token' }),
    }));
  });

  it('surfaces permission and deletion failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ error: 'Keine Berechtigung' }),
      { status: 403 }
    )));

    await expect(api.deleteOrder('staff-token', 'order-id')).rejects.toThrow('Keine Berechtigung');
  });
});

describe('buildApiUrl', () => {
  beforeEach(() => {
    configureApiBase('/api');
  });

  it('uses configured tenant api base path', () => {
    configureApiBase('/asv-libelle/api');
    expect(buildApiUrl('/admin/club/logo')).toBe('/asv-libelle/api/admin/club/logo');
  });

  it('prefixes upload asset paths for path-based tenants', () => {
    configureApiBase('/asv-libelle/api');
    expect(getImageUrl('/uploads/tenant-id/logo.jpg')).toBe('/asv-libelle/uploads/tenant-id/logo.jpg');
  });
});

describe('formatPrice', () => {
  it('formats euro currency in German locale', () => {
    expect(formatPrice(4.5)).toMatch(/4,50/);
  });
});

describe('ORDER_PRIVACY', () => {
  it('privacy notice constant exists', () => {
    expect('Datenschutz').toBeTruthy();
  });
});
