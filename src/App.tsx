import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './redux/store/store';
import UserRoutes from './routes/UserRoutes'; 
import AdminRoutes from './routes/AdminRoutes'; 


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* User Routes */}
            <Route path="/user/*" element={<UserRoutes />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/user/signin" />} />
          </Routes>
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
