import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminRoute, PublicRoute } from '../components/authRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import Dashboard from '../pages/admin/AdminDashboard';
import Users from '../pages/admin/Users';
import Posts from '../pages/admin/Posts';
import Marketplace from '../pages/admin/Marketplace';
import Reports from '../pages/admin/Reports';
import Premium from '../pages/admin/Premium';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route for Admin Login */}
      <Route path="login" element={<PublicRoute element={<AdminLoginPage />} />} />

      {/* Protected Admin Routes (with AdminLayout) */}
      <Route path="/" element={<AdminRoute element={<AdminLayout />} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="posts" element={<Posts />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="reports" element={<Reports />} />
        <Route path="premium" element={<Premium />} />
        {/* Redirect unknown paths to the dashboard */}
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
