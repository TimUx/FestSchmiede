export type RoutingScope = 'tenant' | 'platform' | 'unknown';

export interface RoutingConfig {
  scope: RoutingScope;
  basename: string;
  tenantSlug: string | null;
  matchedBy: 'subdomain' | 'path_prefix' | 'default_fallback' | 'custom_domain' | null;
  baseDomain: string;
  pathPrefixEnabled: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  platformUrl: string;
  tenantUrl: string | null;
}

export const DEFAULT_ROUTING: RoutingConfig = {
  scope: 'tenant',
  basename: '',
  tenantSlug: null,
  matchedBy: 'default_fallback',
  baseDomain: 'festmanager.org',
  pathPrefixEnabled: false,
  maintenanceMode: false,
  maintenanceMessage: null,
  platformUrl: 'https://festmanager.org',
  tenantUrl: null,
};
