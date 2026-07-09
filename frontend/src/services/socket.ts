import { useSyncExternalStore } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || '';

let socket: Socket | null = null;
let authToken: string | null = null;
let lastJoinedEventId: string | null = null;
let connected = false;
const statusListeners = new Set<() => void>();

function notifyStatusListeners(): void {
  statusListeners.forEach((listener) => listener());
}

function subscribeSocketStatus(listener: () => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

function getSocketConnectedSnapshot(): boolean {
  return connected;
}

export function useSocketStatus(): { connected: boolean } {
  const isConnected = useSyncExternalStore(subscribeSocketStatus, getSocketConnectedSnapshot, () => true);
  return { connected: isConnected };
}

function attachSocketHandlers(s: Socket): void {
  s.off('connect');
  s.off('disconnect');
  s.on('connect', () => {
    connected = true;
    notifyStatusListeners();
    if (lastJoinedEventId) {
      s.emit('join:event', lastJoinedEventId);
    }
  });
  s.on('disconnect', () => {
    connected = false;
    notifyStatusListeners();
  });
}

export function configureSocketAuth(token: string | null): void {
  authToken = token;
  if (socket) {
    socket.auth = { token: token ?? undefined };
    if (socket.connected) {
      socket.disconnect();
      socket.connect();
    }
  }
}

export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: { token: authToken ?? undefined },
    });
    connected = socket.connected;
    attachSocketHandlers(socket);
  }
  return socket;
}

export function joinEvent(eventId: string): void {
  lastJoinedEventId = eventId;
  getSocket().emit('join:event', eventId);
}

export function joinPickupBoard(eventId: string): void {
  getSocket().emit('join:pickup-board', eventId);
}

export function joinOrder(lookupToken: string, lastName?: string): void {
  getSocket().emit('join:order', { lookupToken, lastName });
}

export function leaveOrder(orderId: string): void {
  getSocket().emit('leave:order', orderId);
}

export function onOrderUpdated(callback: (order: unknown) => void): () => void {
  const s = getSocket();
  s.on('order:updated', callback);
  return () => s.off('order:updated', callback);
}

export function onOrderCreated(callback: (order: unknown) => void): () => void {
  const s = getSocket();
  s.on('order:created', callback);
  return () => s.off('order:created', callback);
}

export function onEventUpdated(callback: (event: unknown) => void): () => void {
  const s = getSocket();
  s.on('event:updated', callback);
  return () => s.off('event:updated', callback);
}

export function onFoodItemsUpdated(callback: (items: unknown) => void): () => void {
  const s = getSocket();
  s.on('fooditems:updated', callback);
  return () => s.off('fooditems:updated', callback);
}

export function onClubUpdated(callback: (club: unknown) => void): () => void {
  const s = getSocket();
  s.on('club:updated', callback);
  return () => s.off('club:updated', callback);
}

export function onPrintJob(callback: (job: {
  jobId: string;
  printerId: string;
  printerName: string;
  template: string;
  title: string;
  html?: string;
  lines?: string[];
  pdfBase64?: string;
}) => void): () => void {
  const s = getSocket();
  s.on('print:job', callback);
  return () => s.off('print:job', callback);
}
