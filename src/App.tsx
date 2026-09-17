import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Deliveries from './pages/Deliveries';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

// Public route wrapper (redirect if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/produits" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/commandes" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/factures" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path="/reglements" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/livraisons" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
      <Route path="/rapports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/parametres" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
