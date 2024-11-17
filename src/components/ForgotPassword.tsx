import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Toaster, toast } from 'sonner';
import { api } from '../api/userApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promise = api.forgotPassword(email);
      
      toast.promise(promise, {
        loading: 'Sending reset link...',
        success: () => {
          setSent(true);
          return 'Password reset link has been sent to your email';
        },
        error: (err) => err.response?.data?.message || 'An error occurred'
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center h-full">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md p-6">
        <h2 className="text-3xl font-bold mb-6 dark:text-black">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{mb:2}}
            disabled={sent}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={sent}
          >
            {sent ? 'Check Your Email' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;