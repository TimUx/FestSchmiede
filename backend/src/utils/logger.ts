export const logger = {
  privateMeta(meta?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!meta) return undefined;
    return meta;
  },

  withTenant(meta?: Record<string, unknown>, tenantId?: string): Record<string, unknown> | undefined {
    if (!meta && !tenantId) return undefined;
    return { ...(meta ?? {}), ...(tenantId ? { tenant_id: tenantId } : {}) };
  },

  info(message: string, meta?: unknown, tenantId?: string) {
    const payload = typeof meta === 'object' && meta !== null && !Array.isArray(meta)
      ? this.withTenant(meta as Record<string, unknown>, tenantId)
      : tenantId
        ? { tenant_id: tenantId, meta }
        : meta;
    console.log(`[INFO] ${new Date().toISOString()} ${message}`, payload ?? '');
  },

  warn(message: string, meta?: unknown, tenantId?: string) {
    const payload = typeof meta === 'object' && meta !== null && !Array.isArray(meta)
      ? this.withTenant(meta as Record<string, unknown>, tenantId)
      : tenantId
        ? { tenant_id: tenantId, meta }
        : meta;
    console.warn(`[WARN] ${new Date().toISOString()} ${message}`, payload ?? '');
  },

  error(message: string, error?: unknown, tenantId?: string) {
    console.error(
      `[ERROR] ${new Date().toISOString()} ${message}`,
      tenantId ? { tenant_id: tenantId, error } : error ?? ''
    );
  },
};
