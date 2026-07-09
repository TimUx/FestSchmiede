import type { Response, NextFunction } from 'express';
import type { TenantService } from '../platform/tenant/TenantService';
import type { TenantContext } from '../platform/tenant/TenantContext';
import type { PlatformContext } from '../platform/tenant/PlatformContext';

export function createTenantController(
  tenantService: TenantService,
  tenantContext: TenantContext,
  platformContext: PlatformContext
) {
  return {
    async getPublic(_req: unknown, res: Response, next: NextFunction) {
      try {
        const ctx = tenantContext.require();
        const tenant = await tenantService.findById(ctx.id);
        if (!tenant) {
          res.status(404).json({ error: 'Der angeforderte Veranstalter wurde nicht gefunden.' });
          return;
        }
        const data = await tenantService.getPublicData(tenant);
        res.json(data);
      } catch (error) {
        next(error);
      }
    },

    async getPlatformPublic(_req: unknown, res: Response, next: NextFunction) {
      try {
        const platform = platformContext.current();
        res.json({
          name: platform.platformName,
          version: platform.platformVersion,
          baseDomain: platform.baseDomain,
          maintenanceMode: platform.maintenanceMode,
          maintenanceMessage: platform.maintenanceMessage ?? null,
        });
      } catch (error) {
        next(error);
      }
    },
  };
}
