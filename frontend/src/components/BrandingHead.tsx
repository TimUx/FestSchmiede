import { useEffect } from 'react';
import { useRouting } from '@/contexts/RoutingProvider';
import { useTenant } from '@/contexts/TenantProvider';
import { usePlatform } from '@/contexts/PlatformProvider';
import { getImageUrl } from '@/services/api';

export function BrandingHead({ titleSuffix }: { titleSuffix?: string }) {
  const { routing } = useRouting();
  const { tenant } = useTenant();
  const { platform } = usePlatform();

  useEffect(() => {
    let title: string;
    let favicon: string | undefined;

    if (routing.scope === 'platform') {
      title = platform.name;
      favicon = undefined;
    } else if (routing.scope === 'tenant') {
      title = tenant.name;
      favicon = tenant.logoUrl ? getImageUrl(tenant.logoUrl) : undefined;
    } else {
      title = 'FestManager';
    }

    if (titleSuffix) {
      document.title = `${titleSuffix} · ${title}`;
    } else {
      document.title = title;
    }

    const link =
      document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
      (() => {
        const el = document.createElement('link');
        el.rel = 'icon';
        document.head.appendChild(el);
        return el;
      })();

    link.href = favicon ?? '/favicon.ico';

    document.documentElement.lang = (
      routing.scope === 'tenant' ? tenant.locale : platform.defaultLocale ?? 'de-DE'
    ).split('-')[0];
  }, [
    routing.scope,
    tenant.name,
    tenant.logoUrl,
    tenant.locale,
    platform.name,
    platform.defaultLocale,
    titleSuffix,
  ]);

  return null;
}
