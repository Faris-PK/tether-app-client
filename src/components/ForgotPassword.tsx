import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { api } from '../api/userApi';
import { Toaster, toast } from 'sonner';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.forgotPassword(email);
      toast.success('OTP has been sent to your email');
      setOtpSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center h-full">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold mb-6">Forgot Password</h2>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            
            sx={{mb:2}}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={otpSent}
          >
            {otpSent ? 'OTP Sent' : 'Send OTP'}
          </Button>
        </form>

        {otpSent && (
          <Button
            variant="text"
            color="primary"
            fullWidth
            onClick={() => navigate('/user/reset-password', { state: { email } })}
            sx={{ mt: 2 }}
          >
            Proceed to Reset Password
          </Button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;