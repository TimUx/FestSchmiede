import { useState, useEffect, useRef } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PersonIcon from '@mui/icons-material/Person';
import { StaffLayout } from '@/components/StaffLayout';
import { StaffKioskActions } from '@/components/StaffKioskActions';
import { Numpad } from '@/components/Numpad';
import { StatusChip } from '@/components/StatusChip';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffEvent } from '@/contexts/StaffEventContext';
import { api, formatPrice } from '@/services/api';
import { Order } from '@/types';
import { touchFieldSx, touchPrimaryButtonSx, touchIconButtonSx } from '@/theme/touch';

/** Zerlegt eine Eingabe wie "12, 15 20" in eindeutige, positive Abholnummern. */
function parseOrderNumbers(input: string): number[] {
  const numbers = input
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map((part) => parseInt(part, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  return Array.from(new Set(numbers));
}

function customerName(order: Order): string {
  if (!order.customer) return '';
  return [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ').trim();
}

export function AbholungPage() {
  const { token } = useAuth();
  const { selectedEventId, loading: eventsLoading, isPickupOrderable } = useStaffEvent();
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResetTimer = () => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  };

  const resetForNext = () => {
    clearResetTimer();
    setOrderNumber('');
    setOrders([]);
    setErrors([]);
    setDone(false);
  };

  useEffect(() => {
    resetForNext();
  }, [selectedEventId]);

  useEffect(() => clearResetTimer, []);

  const pickupReady = Boolean(selectedEventId && isPickupOrderable(selectedEventId));
  const busy = loading || confirming;

  /** Neue Eingabe nach abgeschlossener Abholung beginnt eine neue Liste. */
  const startNewListIfDone = () => {
    if (!done) return;
    clearResetTimer();
    setOrders([]);
    setErrors([]);
    setDone(false);
  };

  const handleNumberChange = (value: string) => {
    startNewListIfDone();
    setOrderNumber(value);
  };
  const readyOrders = orders.filter((o) => o.status === 'READY');
  const total = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const handleAdd = async () => {
    if (!token || !pickupReady || busy) return;
    const numbers = parseOrderNumbers(orderNumber);
    if (numbers.length === 0) return;

    startNewListIfDone();
    const known = done ? [] : orders;
    const toFetch = numbers.filter((n) => !known.some((o) => o.orderNumber === n));
    setLoading(true);
    setErrors([]);
    const results = await Promise.allSettled(
      toFetch.map((n) => api.lookupOrderByNumber(token, selectedEventId, n))
    );
    const found: Order[] = [];
    const failed: string[] = [];
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        found.push(result.value);
      } else {
        const reason = result.reason instanceof Error ? result.reason.message : 'Bestellung nicht gefunden';
        failed.push(`Nr. ${toFetch[i]}: ${reason}`);
      }
    });
    setOrders((prev) => [...prev, ...found.filter((o) => !prev.some((p) => p.id === o.id))]);
    setErrors(failed);
    setOrderNumber('');
    setLoading(false);
  };

  const removeOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleConfirmPickup = async (targets: Order[]) => {
    if (!token || targets.length === 0 || busy) return;
    setConfirming(true);
    setErrors([]);
    const results = await Promise.allSettled(
      targets.map((o) => api.updateOrderStatus(token, o.id, 'PICKED_UP'))
    );
    const failed: string[] = [];
    const updatedById = new Map<string, Order>();
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        updatedById.set(result.value.id, result.value);
      } else {
        const reason = result.reason instanceof Error ? result.reason.message : 'Fehler bei Abholung';
        failed.push(`Nr. ${targets[i].displayNumber}: ${reason}`);
      }
    });
    // Während der Bestätigung ist Hinzufügen gesperrt; `orders` entspricht daher
    // dem aktuellen Stand. Das funktionale Update hält die Liste trotzdem konsistent.
    const next = orders.map((o) => updatedById.get(o.id) ?? o);
    setOrders((prev) => prev.map((o) => updatedById.get(o.id) ?? o));
    setErrors(failed);
    setConfirming(false);

    if (failed.length === 0 && next.every((o) => o.status === 'PICKED_UP')) {
      setDone(true);
      clearResetTimer();
      resetTimer.current = setTimeout(resetForNext, 2500);
    }
  };

  if (eventsLoading) {
    return (
      <StaffLayout title="Abholung" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout title="Abholung" fullWidth>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 800,
          fontSize: { xs: '1.75rem', sm: '2rem' }
        }}>
        Abholung bestätigen
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 2,
          fontSize: '1.1rem'
        }}>
        Eine oder mehrere Abholnummern eingeben und hinzufügen – z.&nbsp;B. wenn eine Person mehrere
        Bestellungen abholt oder für andere mitbezahlt hat. Bei Online-Bestellungen den angezeigten
        Namen kontrollieren. Die Veranstaltung wählen Sie oben im Kopfbereich.
      </Typography>

      {!selectedEventId && !eventsLoading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Bitte wählen Sie oben eine Veranstaltung aus.
        </Alert>
      )}

      {selectedEventId && !isPickupOrderable(selectedEventId) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Für die gewählte Veranstaltung sind Abholungen derzeit nicht möglich (inaktiv oder Bestellungen geschlossen).
          Bitte wählen Sie oben eine andere Veranstaltung.
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, maxWidth: 560 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{
            alignItems: "stretch"
          }}>
            <TextField
              label="Abholnummer"
              value={orderNumber}
              onChange={(e) => handleNumberChange(e.target.value)}
              placeholder="z.B. 042"
              fullWidth
              autoFocus
              disabled={!pickupReady}
              onKeyDown={(e) => e.key === 'Enter' && void handleAdd()}
              helperText="Mehrere Nummern nacheinander hinzufügen oder mit Komma trennen"
              sx={touchFieldSx}
              slotProps={{ htmlInput: { style: { fontSize: '1.75rem', textAlign: 'center', fontWeight: 700 }, inputMode: 'numeric' } }}
            />
            <Button
              variant="contained"
              onClick={() => void handleAdd()}
              disabled={busy || !pickupReady || parseOrderNumbers(orderNumber).length === 0}
              aria-label="Abholnummer hinzufügen"
              sx={{ ...touchIconButtonSx, minWidth: 72, minHeight: 72, width: 72, height: 72, flexShrink: 0 }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : <AddIcon sx={{ fontSize: 36 }} />}
            </Button>
          </Stack>
          <Numpad value={orderNumber} onChange={handleNumberChange} />
        </Stack>
      </Paper>

      {errors.map((message) => (
        <Alert key={message} severity="error" sx={{ mb: 2, fontSize: '1.05rem', maxWidth: 640 }}>{message}</Alert>
      ))}

      {orders.length > 0 && (
        <Stack spacing={2} sx={{ maxWidth: 640 }}>
          {orders.map((order) => {
            const name = customerName(order);
            return (
              <Paper key={order.id} sx={{ p: { xs: 2.5, sm: 3 }, position: 'relative' }}>
                {order.status !== 'PICKED_UP' && (
                  <IconButton
                    aria-label={`Bestellung ${order.displayNumber} entfernen`}
                    onClick={() => removeOrder(order.id)}
                    disabled={busy}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="overline" sx={{ fontSize: '1rem' }}>Abholnummer</Typography>
                  <Typography
                    variant="h1"
                    color="primary"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '3.5rem', sm: orders.length > 1 ? '4.5rem' : '6rem' },
                      lineHeight: 1.1
                    }}>
                    {order.displayNumber}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <StatusChip status={order.status} />
                    <Chip size="small" label={order.sourceLabel} variant="outlined" />
                    {order.paymentLabel && (
                      <Chip size="small" label={order.paymentLabel} variant="outlined" />
                    )}
                  </Box>
                  {name && (
                    <Box sx={{ mt: 1.5, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="action" />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{name}</Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  {order.items.map((item) => (
                    <Box key={item.id || item.foodItemId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" sx={{
                        fontWeight: 600
                      }}>{item.quantity}× {item.name}</Typography>
                      <Typography variant="h6">{formatPrice(item.lineTotal || 0)}</Typography>
                    </Box>
                  ))}
                </Stack>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    textAlign: "right",
                    mb: 2
                  }}>
                  Summe: {formatPrice(order.totalPrice)}
                </Typography>

                {order.status === 'READY' && orders.length > 1 && (
                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    onClick={() => void handleConfirmPickup([order])}
                    disabled={busy}
                    startIcon={<DoneAllIcon />}
                    sx={{ minHeight: 56, fontSize: '1.1rem' }}
                  >
                    Nur diese abholen
                  </Button>
                )}

                {order.status === 'PICKED_UP' && (
                  <Alert severity="success" sx={{ fontSize: '1.05rem' }}>
                    Abholung bestätigt
                  </Alert>
                )}

                {order.status !== 'READY' && order.status !== 'PICKED_UP' && (
                  <Alert severity="info" sx={{ fontSize: '1.05rem' }}>
                    Bestellung ist noch nicht fertig (Status: {order.statusLabel})
                  </Alert>
                )}
              </Paper>
            );
          })}

          <Paper sx={{ p: { xs: 2.5, sm: 3 } }}>
            {orders.length > 1 && (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  textAlign: "right",
                  mb: 2
                }}>
                Gesamt ({orders.length} Bestellungen): {formatPrice(total)}
              </Typography>
            )}

            {readyOrders.length > 0 && (
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={() => void handleConfirmPickup(readyOrders)}
                disabled={busy}
                sx={{
                  ...touchPrimaryButtonSx,
                  minHeight: 80,
                  fontSize: '1.35rem',
                  flexDirection: 'column',
                  gap: 1,
                  py: 2,
                }}
              >
                <DoneAllIcon sx={{ fontSize: 40 }} />
                {readyOrders.length > 1
                  ? `Alle ${readyOrders.length} abholbereiten bestätigen`
                  : 'Abholung bestätigen'}
              </Button>
            )}

            {done && (
              <Alert severity="success" sx={{ fontSize: '1.1rem' }}>
                Abholung bestätigt – Formular wird zurückgesetzt…
              </Alert>
            )}

            {!done && (
              <Button
                variant="text"
                fullWidth
                onClick={resetForNext}
                disabled={busy}
                sx={{ mt: readyOrders.length > 0 ? 1.5 : 0, minHeight: 48 }}
              >
                Liste leeren
              </Button>
            )}
          </Paper>
        </Stack>
      )}

      <Box sx={{ mt: 4 }}>
        <StaffKioskActions />
      </Box>
    </StaffLayout>
  );
}
