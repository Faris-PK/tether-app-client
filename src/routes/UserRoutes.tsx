import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../components/authRoute';
import RegisterPage from '../pages/user/RegisterPage';
import OtpPage from '../pages/user/OtpPage';
import SignInPage from '../pages/user/SignInPage';
import HomePage from '../pages/user/HomePage';
import ProfilePage from '../pages/user/ProfilePage';
import FriendsPage from '@/pages/user/ConnectionPage';


const UserRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="register" element={<PublicRoute element={<RegisterPage />} />} />
      <Route path="signin" element={<PublicRoute element={<SignInPage />} />} />
      <Route path="otp" element={<PublicRoute element={<OtpPage />} />} />

      {/* Private Routes */}
      <Route path="home" element={<PrivateRoute element={<HomePage />} />} />
      <Route path="profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="friends" element={<PrivateRoute element={<FriendsPage />} />} />
      

      {/* Fallback to Sign-in if no route matches */}
      <Route path="*" element={<Navigate to="signin" />} />
    </Routes>
  );
};

export default UserRoutes;
