import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EuroIcon from '@mui/icons-material/Euro';
import { StaffLayout } from '@/components/StaffLayout';
import { StaffKioskActions } from '@/components/StaffKioskActions';
import { DishQuantityOverview } from '@/components/DishQuantityOverview';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffEvent } from '@/contexts/StaffEventContext';
import { api, formatPrice } from '@/services/api';
import { DashboardStats } from '@/types';
import { subscribeEventStats } from '@/services/realtime/channels';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
        <Box sx={{ color, fontSize: 36, flexShrink: 0, display: 'flex' }}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{
            color: "text.secondary"
          }}>
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              wordBreak: 'break-word',
              lineHeight: 1.2
            }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { token } = useAuth();
  const { selectedEventId, loading: eventsLoading } = useStaffEvent();
  const [snapshot, setSnapshot] = useState<{ eventId: string; data: DashboardStats } | null>(null);
  const [loadedEventId, setLoadedEventId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const stats = snapshot?.eventId === selectedEventId ? snapshot.data : null;

  useEffect(() => {
    setError('');
    setSnapshot(null);
    setLoadedEventId(null);
    if (!token || !selectedEventId) {
      return;
    }
    let active = true;
    let receivedRealtimeStats = false;
    const updateStats = (data: DashboardStats) => {
      if (!active) return;
      setSnapshot({ eventId: selectedEventId, data });
      setLoadedEventId(selectedEventId);
      setError('');
    };
    api.getStats(token, selectedEventId)
      .then((data) => {
        if (!receivedRealtimeStats) updateStats(data);
      })
      .catch((err) => {
        if (!active || receivedRealtimeStats) return;
        setError(err instanceof Error ? err.message : 'Fehler');
        setLoadedEventId(selectedEventId);
      });
    const unsubscribe = subscribeEventStats(token, selectedEventId, (data) => {
      receivedRealtimeStats = true;
      updateStats(data);
    }, 'normal');
    return () => {
      active = false;
      unsubscribe();
    };
  }, [selectedEventId, token]);

  if (eventsLoading || (token && selectedEventId && loadedEventId !== selectedEventId)) {
    return (
      <StaffLayout title="Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </StaffLayout>
    );
  }

  const statItems: StatCardProps[] = [
    { title: 'Bestellungen', value: stats?.totalOrders ?? 0, icon: <ReceiptIcon fontSize="inherit" />, color: 'primary.main' },
    { title: 'Offen', value: stats?.openOrders ?? 0, icon: <HourglassEmptyIcon fontSize="inherit" />, color: 'warning.main' },
    { title: 'Fertig', value: stats?.readyOrders ?? 0, icon: <CheckCircleIcon fontSize="inherit" />, color: 'success.main' },
    { title: 'Abgeholt', value: stats?.pickedUpOrders ?? 0, icon: <DoneAllIcon fontSize="inherit" />, color: 'info.main' },
    { title: 'Umsatz', value: formatPrice(stats?.revenue ?? 0), icon: <EuroIcon fontSize="inherit" />, color: 'secondary.main' },
  ];

  return (
    <StaffLayout title="Dashboard">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!selectedEventId && <Alert severity="info" sx={{ mb: 2 }}>Bitte eine Veranstaltung auswählen.</Alert>}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 2,
          mb: 4,
        }}
      >
        {statItems.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </Box>

      {stats && <DishQuantityOverview key={selectedEventId} dishes={stats.dishQuantities} />}

      <Box>
        <Typography variant="h5" gutterBottom sx={{
          fontWeight: 800
        }}>
          Schnellzugriff
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2
          }}>
          Häufig genutzte Funktionen für Kasse und Abholung.
        </Typography>
        <StaffKioskActions variant="dashboard" />
      </Box>
    </StaffLayout>
  );
}
