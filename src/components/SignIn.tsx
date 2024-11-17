import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../redux/slices/userSlice';
import { GoogleLogin } from '@react-oauth/google';
import { api } from '../api/userApi';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Toaster, toast } from 'sonner';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading toast
    const loadingToast = toast.loading('Signing in...');
    
    try {
      
      
      const response = await api.login(email, password);
      dispatch(setUser(response.user));
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Login successful!');
      
    
        navigate('/user/home');
     

    } catch (error: any) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const loadingToast = toast.loading('Signing in with Google...');
    
    try {
      console.log('Google login successful. Credential:', credentialResponse);
      const response = await api.googleLogin(credentialResponse.credential);

      console.log('Backend response:', response);
      dispatch(setUser(response.user));
      
      toast.dismiss(loadingToast);
      toast.success('Google login successful!');

     
        navigate('/user/home');
    

      
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'An error occurred during Google login');
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-in error');
    toast.error('Google sign-in was unsuccessful. Please try again.');
  };

  return (
    <>
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center h-full overflow-hidden">
        <Toaster position="top-center" richColors />
        <div className="w-full max-w-md p-6">
          <div className="flex justify-end mb-20 ml-2">
            <p className="text-black font-medium mr-2">New to Tether?</p>
            <Link to="/user/register" className="text-[#1D9BF0] font-black hover:text-[#2589cc] transition duration-200">
              Sign Up
            </Link>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-black">Welcome back</h2>
          <h2 className="text-3xl font-bold mb-16 text-black">to Tether</h2>
          <p className="font-bold text-gray-500 mb-2">Sign In to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Connect Now
            </Button>
          </form>
          
          <Link
            to="/user/forgot-password"
            className="text-[#1D9BF0] text-sm font-sans font-medium hover:text-[#2589cc] mt-2 block text-right"
          >
            Forgot Password?
          </Link>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-600">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;