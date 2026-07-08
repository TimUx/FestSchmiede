import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ClubProvider } from '@/contexts/ClubContext';
import { ProtectedRoute } from '@/components/StaffLayout';
import { useAuth } from '@/contexts/AuthContext';
import { OrderPage } from '@/pages/OrderPage';
import { OrderStatusPage } from '@/pages/OrderStatusPage';
import { PickupBoardPage } from '@/pages/PickupBoardPage';
import { ContactPage } from '@/pages/ContactPage';
import { LoginPage } from '@/pages/staff/LoginPage';
import { DashboardPage } from '@/pages/staff/DashboardPage';
import { KitchenPage } from '@/pages/staff/KitchenPage';
import { AbholungPage } from '@/pages/staff/AbholungPage';
import { BestellungPage } from '@/pages/staff/BestellungPage';
import { OrdersPage } from '@/pages/staff/OrdersPage';
import { FoodItemsPage } from '@/pages/staff/FoodItemsPage';
import { EventsPage } from '@/pages/staff/EventsPage';
import { ClubSettingsPage } from '@/pages/staff/ClubSettingsPage';

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/mitarbeiter/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/mitarbeiter" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <ClubProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<OrderPage />} />
              <Route path="/kontakt" element={<ContactPage />} />
              <Route path="/status" element={<OrderStatusPage />} />
              <Route path="/status/:orderId" element={<OrderStatusPage />} />
              <Route path="/abholboard" element={<PickupBoardPage />} />
              <Route path="/mitarbeiter/login" element={<LoginPage />} />
              <Route path="/mitarbeiter" element={<AdminRoute><DashboardPage /></AdminRoute>} />
              <Route path="/mitarbeiter/bestellungen" element={<AdminRoute><OrdersPage /></AdminRoute>} />
              <Route path="/mitarbeiter/kueche" element={<AdminRoute><KitchenPage /></AdminRoute>} />
              <Route path="/mitarbeiter/abholung" element={<AdminRoute><AbholungPage /></AdminRoute>} />
              <Route path="/mitarbeiter/bestellung" element={<AdminRoute><BestellungPage /></AdminRoute>} />
              <Route path="/mitarbeiter/speisen" element={<AdminOnlyRoute><FoodItemsPage /></AdminOnlyRoute>} />
              <Route path="/mitarbeiter/veranstaltungen" element={<AdminOnlyRoute><EventsPage /></AdminOnlyRoute>} />
              <Route path="/mitarbeiter/verein" element={<AdminOnlyRoute><ClubSettingsPage /></AdminOnlyRoute>} />
              {/* Alte Routen weiterleiten */}
              <Route path="/mitarbeiter/kasse" element={<Navigate to="/mitarbeiter/abholung" replace />} />
              <Route path="/mitarbeiter/lokale-kasse" element={<Navigate to="/mitarbeiter/bestellung" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ClubProvider>
    </ThemeProvider>
  );
}
