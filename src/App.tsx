import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { GuestLayout } from '@/components/layout/GuestLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { RoomManagement } from '@/pages/admin/RoomManagement';
import { RestaurantManagement } from '@/pages/admin/RestaurantManagement';
import { UserRoleManagement } from '@/pages/admin/UserRoleManagement';
import { GuestDashboard } from '@/pages/guest/GuestDashboard';
import { AuthForm } from '@/components/auth/AuthForm';
import { AdminSetup } from '@/pages/AdminSetup';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthForm />} />

            {/* Admin Routes */}
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <RoomManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <UserRoleManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurant"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <RestaurantManagement />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Guest Routes */}
            <Route
              path="/guest"
              element={
                <ProtectedRoute requiredRole="guest">
                  <GuestLayout>
                    <GuestDashboard />
                  </GuestLayout>
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
