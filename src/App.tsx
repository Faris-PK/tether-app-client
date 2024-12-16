import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './redux/store/store';
import UserRoutes from './routes/UserRoutes'; 
import AdminRoutes from './routes/AdminRoutes'; 
import { SocketProvider } from './contexts/SocketContext';
import 'react-toastify/dist/ReactToastify.css';
import VideoCallNotification from './components/common/VideoCallNotification';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <SocketProvider>
          <Router>
          <VideoCallNotification />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />

              {/* User Routes */}
              <Route path="/user/*" element={<UserRoutes />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/user/signin" />} />
            </Routes>
          </Router>
        </SocketProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;