import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Toaster, toast } from 'sonner';
import { api } from '../api/userApi';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    if (!resetToken) {
      toast.error('Invalid reset link');
      return;
    }
    setToken(resetToken);
  }, [location]);

  // Simple password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validate confirm password
  const validateConfirmPassword = (password: string, confirmPwd: string) => {
    if (!confirmPwd) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (password !== confirmPwd) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword) || !validateConfirmPassword(newPassword, confirmPassword)) {
      return;
    }

    try {
      const promise = api.resetPassword(token, newPassword);
      
      toast.promise(promise, {
        loading: 'Resetting password...',
        success: () => {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return 'Password reset successful! Redirecting to login...';
        },
        error: (err) => err.response?.data?.message || 'An error occurred'
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  if (!token) {
    return (
      <div className="text-center p-6">
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center h-full">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold mb-6">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePassword(e.target.value);
              if (confirmPassword) {
                validateConfirmPassword(e.target.value, confirmPassword);
              }
            }}
            fullWidth
            error={!!passwordError}
            helperText={passwordError}
            sx={{mb: 2}}
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirmPassword(newPassword, e.target.value);
            }}
            fullWidth
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            sx={{mb: 2}}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!newPassword || !confirmPassword || !!passwordError || !!confirmPasswordError}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;