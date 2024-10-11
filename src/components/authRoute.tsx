import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

// PrivateRoute: Only accessible when user is authenticated
export const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/user/signin" />;
};

// PublicRoute: Only accessible when user is NOT authenticated
export const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  return isAuthenticated ? <Navigate to="/user/home" /> : element;
};

// AdminRoute: Only accessible when admin is authenticated
export const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAdmin = useSelector((state: RootState) => state.admin.isAdmin);
  return isAdmin ? element : <Navigate to="/admin/login" />;
};

// AdminPublicRoute: Only accessible when admin is NOT authenticated
export const AdminPublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const isAdmin = useSelector((state: RootState) => state.admin.isAdmin);
  return isAdmin ? <Navigate to="/admin/dashboard" /> : element;
};