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
import SharedPostPage from '@/pages/user/SharedPostPage';
import PromotionSuccessPage from '@/pages/user/PromotionSuccessPage';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/user/ResetPasswordPage';
import PremiumSubscriptionPage from '@/pages/user/PremiumSubscriptionPage';
import Room from '@/components/live/Room';
import { ToastContainer } from 'react-toastify';
import ChatPage from '@/pages/user/ChatPage';

const UserRoutes: React.FC = () => {
  return (
    <ThemeProvider>
      {/* ToastContainer should be outside of Routes */}
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="register" element={<PublicRoute element={<RegisterPage />} />} />
        <Route path="signin" element={<PublicRoute element={<SignInPage />} />} />
        <Route path="otp" element={<PublicRoute element={<OtpPage />} />} />
        <Route path="forgot-password" element={<PublicRoute element={<ForgotPasswordPage />} />} />
        <Route path="reset-password" element={<PublicRoute element={<ResetPasswordPage />} />} />

        {/* Private Routes */}
        <Route path="home" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="profile" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="UserProfile/:userId" element={<PrivateRoute element={<UserProfile />} />} />
        <Route path="post/:postId" element={<PrivateRoute element={<SharedPostPage />} />} />
        <Route path="MarketPlace" element={<PrivateRoute element={<Marketplace />} />} />
        <Route path="paymentsuccess" element={<PaymentSuccessPage />} />
        <Route path="payment/cancel" element={<Navigate to="/user/home" />} />
        <Route path="promotesuccess" element={<PromotionSuccessPage />} />
        <Route path="premium" element={<PremiumSubscriptionPage />} />
        <Route path="messages" element={<ChatPage />} />
        <Route path="live/room/:roomId" element={<PrivateRoute element={<Room />} />} />

        {/* Fallback to Sign-in if no route matches */}
        <Route path="*" element={<Navigate to="signin" />} />
      </Routes>
    </ThemeProvider>
  );
};

export default UserRoutes;
