import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PaymentAdminPage } from '@/pages/admin/payment/PaymentAdminPage';

/**
 * Optionale Einstellungsseiten pro Namespace.
 * Standard bleibt GenericSettingsPage (Metadata → DynamicSettingsForm).
 * Module mit komplexerer UX registrieren hier eine eigene Seite.
 */
const SETTINGS_PAGE_COMPONENTS: Record<string, () => ReactNode> = {
  'module.payment': () => <PaymentAdminPage />,
};

/** Legacy-Pfade → Ziel mit Default-Tab */
const SETTINGS_REDIRECTS: Record<string, string> = {};

export function renderSettingsPage(namespace?: string): ReactNode | null {
  if (!namespace) return null;
  const redirect = SETTINGS_REDIRECTS[namespace];
  if (redirect) return <Navigate to={redirect} replace />;
  const Page = SETTINGS_PAGE_COMPONENTS[namespace];
  return Page ? <Page /> : null;
}
