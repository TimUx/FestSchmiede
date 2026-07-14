import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { StaffEventProvider } from '@/contexts/StaffEventContext';
import { ProtectedRoute } from '@/components/StaffLayout';

function StaffOutletFallback() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <CircularProgress />
    </Box>
  );
}

export function StaffArea() {
  return (
    <StaffEventProvider>
      <ProtectedRoute>
        <Suspense fallback={<StaffOutletFallback />}>
          <Outlet />
        </Suspense>
      </ProtectedRoute>
    </StaffEventProvider>
  );
}
