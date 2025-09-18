import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth.store';

// Pages
import { LandingPage } from './pages/landing/landing.page';
import { LoginPage } from './pages/auth/login.page';
import { RegisterPage } from './pages/auth/register.page';
import { PWAManager } from './components/pwa/pwa-manager';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { CustomerDashboardPage } from './pages/dashboard/customer-dashboard.page';
import { DriverDashboardPage } from './pages/dashboard/driver-dashboard.page';
import { AdminDashboardPage } from './pages/dashboard/admin-dashboard.page';

// Components
import { ProtectedRoute } from './components/auth/protected-route';

function App() {
  const { checkAuth, isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app start
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'customer' ? (
                  <CustomerDashboardPage />
                ) : user?.role === 'driver' ? (
                  <DriverDashboardPage />
                ) : user?.role === 'admin' ? (
                  <AdminDashboardPage />
                ) : (
                  <DashboardPage />
                )}
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing or dashboard based on auth status */}
          <Route path="*" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
          } />
        </Routes>
      </div>

      {/* PWA Manager */}
      <PWAManager />
    </Router>
  );
}

export default App;
