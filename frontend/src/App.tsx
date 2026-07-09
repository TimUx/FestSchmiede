import { BrowserRouter } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { RoutingProvider, useRouting } from '@/contexts/RoutingProvider';
import { PlatformProvider } from '@/contexts/PlatformProvider';
import { TenantProvider } from '@/contexts/TenantProvider';
import { AppThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ImpersonationBanner } from '@/components/ImpersonationBanner';
import { TenantRoutes } from '@/routes/TenantRoutes';
import { PlatformRoutes } from '@/routes/PlatformRoutes';
import { TenantNotFoundPage } from '@/pages/errors/TenantNotFoundPage';

function AppRouter() {
  const { routing } = useRouting();

  if (routing.scope === 'unknown') {
    return <TenantNotFoundPage />;
  }

  if (routing.scope === 'platform') {
    return <PlatformRoutes />;
  }

  return <TenantRoutes />;
}

function AppBootstrap() {
  const { loading, error, routing } = useRouting();

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100dvh" gap={2}>
        <CircularProgress />
        <Typography color="text.secondary">FestManager wird geladen…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100dvh" px={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <BrowserRouter basename={routing.basename || undefined}>
      <PlatformProvider>
        <TenantProvider>
          <AppThemeProvider>
            <AuthProvider>
              <ImpersonationBanner />
              <AppRouter />
            </AuthProvider>
          </AppThemeProvider>
        </TenantProvider>
      </PlatformProvider>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <RoutingProvider>
      <AppBootstrap />
    </RoutingProvider>
  );
}
