export interface TenantPublicData {
  name: string;
  shortName?: string | null;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  theme: string;
  locale: string;
  timezone: string;
  currency: string;
}

export interface PlatformPublicData {
  name: string;
  version: string;
  baseDomain: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string | null;
}

export const DEFAULT_TENANT: TenantPublicData = {
  name: 'FestManager',
  slug: 'default',
  theme: 'default',
  locale: 'de-DE',
  timezone: 'Europe/Berlin',
  currency: 'EUR',
};

export const DEFAULT_PLATFORM: PlatformPublicData = {
  name: 'FestManager',
  version: '2.0.0',
  baseDomain: 'festmanager.org',
  maintenanceMode: false,
};
