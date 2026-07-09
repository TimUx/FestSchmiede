import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TenantPublicData, DEFAULT_TENANT } from '@/types/tenant';
import { api } from '@/services/api';
import { subscribeTenantUpdates } from '@/services/realtime/channels';

interface TenantContextType {
  tenant: TenantPublicData;
  loading: boolean;
  refresh: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantPublicData>(DEFAULT_TENANT);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await api.getTenant();
      setTenant({ ...DEFAULT_TENANT, ...data });
    } catch {
      try {
        const club = await api.getClub();
        setTenant({
          ...DEFAULT_TENANT,
          name: club.clubName,
          description: club.description,
          contactName: club.contactName,
          email: club.email,
          phone: club.phone,
          address: club.address,
          website: club.website,
          logoUrl: club.logoUrl,
        });
      } catch {
        setTenant(DEFAULT_TENANT);
      }
    }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    const unsub = subscribeTenantUpdates((data) => {
      setTenant({ ...DEFAULT_TENANT, ...data });
    });
    return unsub;
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, refresh }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant muss innerhalb von TenantProvider verwendet werden');
  return ctx;
}
