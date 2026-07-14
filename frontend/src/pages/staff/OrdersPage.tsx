import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { StaffLayout } from '@/components/StaffLayout';
import { OrderCard } from '@/components/OrderCard';
import { OrderEditDialog } from '@/components/OrderEditDialog';
import { OrdersExportActions } from '@/components/OrdersExportActions';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffEvent } from '@/contexts/StaffEventContext';
import { api } from '@/services/api';
import { subscribeEventOrders } from '@/services/realtime/channels';
import { Order, OrderStatus } from '@/types';

export function OrdersPage() {
  const { token } = useAuth();
  const { selectedEventId, selectedEvent, loading: eventsLoading } = useStaffEvent();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (eventsLoading) return;
    setLoading(false);
  }, [eventsLoading]);

  const loadOrders = () => {
    if (!token || !selectedEventId) return;
    api.getOrders(token, selectedEventId)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Fehler'));
  };

  useEffect(() => {
    if (!token || !selectedEventId) {
      setOrders([]);
      return;
    }
    loadOrders();
    return subscribeEventOrders(token, selectedEventId, '', setOrders, 'normal');
  }, [selectedEventId, token]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    if (!token) return;
    try {
      await api.updateOrderStatus(token, orderId, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
    }
  };

  const handleReleaseToKitchen = async (orderId: string) => {
    if (!token) return;
    setError('');
    try {
      const updated = await api.releaseOrderToKitchen(token, orderId);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler');
    }
  };

  if (loading || eventsLoading) {
    return (
      <StaffLayout title="Bestellungen">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout title="Bestellungen">
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {token && selectedEventId && (
        <OrdersExportActions
          token={token}
          eventId={selectedEventId}
          eventName={selectedEvent?.name ?? ''}
          onError={setError}
        />
      )}
      <Stack spacing={2}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            showActions
            onEdit={() => setEditingOrder(order)}
            onStatusChange={(status) => void handleStatusChange(order.id, status)}
            onReleaseToKitchen={() => void handleReleaseToKitchen(order.id)}
          />
        ))}
      </Stack>
      {token && (
        <OrderEditDialog
          open={editingOrder !== null}
          order={editingOrder}
          eventId={selectedEventId}
          token={token}
          onClose={() => setEditingOrder(null)}
          onSaved={(updated) => {
            setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          }}
        />
      )}
      {selectedEventId && orders.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Keine Bestellungen für diese Veranstaltung
        </Typography>
      )}
    </StaffLayout>
  );
}
