// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// import Home from './components/Home';
// import { store } from './redux/store/store';
// import { PrivateRoute, PublicRoute } from './components/authRoute';
// import RegisterPage from './pages/user/RegisterPage';
// import OtpPage from './pages/user/OtpPage';
// import SignInPage from './pages/user/SignInPage';

// const googleclientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// const App: React.FC = () => {
  
//   return (
//     <GoogleOAuthProvider clientId={googleclientId}>
//       <Provider store={store}>
//         <Router>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
//             <Route path="/signin" element={<PublicRoute element={<SignInPage />} />} />
//             <Route path="/otp" element={<PublicRoute element={<OtpPage />} />} />

//             {/* Private Routes */}
//             <Route path="/home" element={<PrivateRoute element={<Home />} />} />

//             {/* Redirect any other path to SignIn */}
//             <Route path="*" element={<Navigate to="/signin" />} />
//           </Routes>
//         </Router>
//       </Provider>
//     </GoogleOAuthProvider>
//   );
// };

// export default App;

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
