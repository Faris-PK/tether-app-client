import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Toaster, toast } from 'sonner';
import { api } from '../api/userApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const promise = api.forgotPassword(email);

      toast.promise(promise, {
        loading: 'Sending reset link...',
        success: () => {
          setSent(true);
          setStep(2);
          return 'Password reset link has been sent to your email';
        },
        error: (err) => err.response?.data?.message || 'An error occurred',
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

        {step === 1 && (
          <div>
            <p className="mb-4 text-gray-700">
              Enter your email below to receive a password reset link.
            </p>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
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
        )}

        {step === 2 && (
          <div>
            <p className="mb-4 text-gray-700">
              A password reset link has been sent to your email. Please follow the instructions in the email to reset your password.
            </p>
            <p className="mb-4 text-gray-700">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                className="text-blue-600 underline"
                onClick={() => {
                  setSent(false);
                  setStep(1);
                }}
              >
                try again
              </button>.
            </p>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setStep(3)}
            >
              I’ve Reset My Password
            </Button>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-4 text-gray-700">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                // Redirect to login page or handle next action
                window.location.href = '/user/login';
              }}
            >
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
