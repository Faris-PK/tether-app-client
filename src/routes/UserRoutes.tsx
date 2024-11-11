import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from '../components/authRoute';
import RegisterPage from '../pages/user/RegisterPage';
import OtpPage from '../pages/user/OtpPage';
import SignInPage from '../pages/user/SignInPage';
import HomePage from '../pages/user/HomePage';
import ProfilePage from '../pages/user/ProfilePage';
import { ThemeProvider } from '../contexts/ThemeContext';
import UserProfile from '../pages/user/UserProfilePage';
import Marketplace from '@/pages/user/MarketPlacePage';
import PaymentSuccessPage from '@/pages/user/PaymentSuccessPage';


const UserRoutes: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="register" element={<PublicRoute element={<RegisterPage />} />} />
        <Route path="signin" element={<PublicRoute element={<SignInPage />} />} />
        <Route path="otp" element={<PublicRoute element={<OtpPage />} />} />

        {/* Private Routes */}
        <Route path="home" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="profile" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="UserProfile" element={<PrivateRoute element={<UserProfile/>} />} />
        <Route path="MarketPlace" element={<PrivateRoute element={<Marketplace/>} />} />
        <Route path="paymentsuccess" element={<PaymentSuccessPage />} />
        <Route path="payment/cancel" element={<Navigate to="/user/home" />} />



        {/* Fallback to Sign-in if no route matches */}
        <Route path="*" element={<Navigate to="signin" />} />
      </Routes>
    </ThemeProvider>
  );
};

export default UserRoutes;
