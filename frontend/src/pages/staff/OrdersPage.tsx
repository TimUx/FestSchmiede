import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  const { token, isAdmin } = useAuth();
  const { selectedEventId, selectedEvent, loading: eventsLoading } = useStaffEvent();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  const handleDelete = async () => {
    if (!token || !isAdmin || !deletingOrder || deleting ||
        deleteConfirmation.trim() !== deletingOrder.displayNumber) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await api.deleteOrder(token, deletingOrder.id);
      setOrders((prev) => prev.filter((order) => order.id !== deletingOrder.id));
      setEditingOrder((prev) => prev?.id === deletingOrder.id ? null : prev);
      setDeletingOrder(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen');
    } finally {
      setDeleting(false);
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
            onDelete={isAdmin ? () => {
              setDeletingOrder(order);
              setDeleteConfirmation('');
              setDeleteError('');
            } : undefined}
            onStatusChange={(status) => void handleStatusChange(order.id, status)}
            onReleaseToKitchen={() => void handleReleaseToKitchen(order.id)}
          />
        ))}
      </Stack>
      <Dialog
        open={deletingOrder !== null}
        onClose={() => { if (!deleting) setDeletingOrder(null); }}
        aria-labelledby="delete-order-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="delete-order-title">
          Bestellung #{deletingOrder?.displayNumber} endgültig löschen?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Nur für falsche, Fake- oder Doppelbestellungen: Die Bestellung einschließlich
            Positionen und Statusverlauf wird unwiderruflich gelöscht und aus Bestellstatistiken,
            Bestelllisten und künftigen Exporten entfernt. Für reguläre Absagen bitte stornieren.
          </Alert>
          <Typography sx={{ mb: 2 }}>
            Zahlungsnachweise bleiben erhalten und können weiterhin in Zahlungsstatistiken
            enthalten sein. Bereits erfolgte Zahlungen werden nicht automatisch erstattet.
            Laufende Onlinezahlungen werden durch das Löschen nicht abgebrochen.
          </Typography>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <TextField
            autoFocus
            fullWidth
            label={`Zur Bestätigung Bestellnummer ${deletingOrder?.displayNumber ?? ''} eingeben`}
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            disabled={deleting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingOrder(null)} disabled={deleting}>Abbrechen</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDelete()}
            disabled={deleting || deleteConfirmation.trim() !== deletingOrder?.displayNumber}
          >
            {deleting ? 'Wird gelöscht …' : 'Endgültig löschen'}
          </Button>
        </DialogActions>
      </Dialog>
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
        <Typography
          sx={{
            color: "text.secondary",
            py: 4,
            textAlign: 'center'
          }}>
          Keine Bestellungen für diese Veranstaltung
        </Typography>
      )}
    </StaffLayout>
  );
}
