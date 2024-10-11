import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { setAdmin } from '../../redux/slices/adminSlice';
import { TextField, Button, Box, Typography } from '@mui/material';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await adminApi.login(email, password);
      console.log('Response from Admin Login page: ', response);
      dispatch(setAdmin(response.admin));
      navigate('/admin/dashboard');
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#002428] to-[#0a3d44] relative">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Tether.</h1>
      </div>

      {/* Vertical line */}
      <div className="hidden lg:block absolute left-1/2 top-1/4 bottom-1/4 w-px bg-[#4f676b]"></div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 ">
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '400px', width: '100%', }}>
          <Typography variant="h4" component="h2" gutterBottom color="white">
            Admin Login
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="filled"
            required
            sx={{ backgroundColor: '#E2E2E2', borderRadius: '4px' }}  
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="filled"
            required
            sx={{ backgroundColor: '#E2E2E2', borderRadius: '4px' }} 
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, bgcolor: '#f26821', '&:hover': { bgcolor: '#e05710' } }}
          >
            Login
          </Button>
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default AdminLoginPage;
