import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import type { UserRole } from './types';

const RoleRoute: React.FC<{ role: UserRole; children: React.ReactNode }> = ({ role, children }) => {
  const { role: currentRole, isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <div className="p-8 text-sm text-slate-500">Restoring your session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (currentRole !== role) return <Navigate to={`/${currentRole}`} replace />;
  return <>{children}</>;
};

const RoleBasedRedirect: React.FC = () => {
  const { role, isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <div className="p-8 text-sm text-slate-500">Restoring your session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'faculty') return <Navigate to="/faculty" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/student" replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Layout Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/student" element={<RoleRoute role="student"><StudentDashboard /></RoleRoute>} />
            <Route path="/faculty" element={<RoleRoute role="faculty"><FacultyDashboard /></RoleRoute>} />
            <Route path="/admin" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
          </Route>

          {/* Root and Fallback Routes */}
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="*" element={<RoleBasedRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
