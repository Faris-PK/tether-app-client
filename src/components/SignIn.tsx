import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../redux/slices/userSlice';
import { GoogleLogin } from '@react-oauth/google';
import { api } from '../api/userApi';
import TextField from '@mui/material/TextField'; // Import TextField
import Button from '@mui/material/Button'; // Import Material UI Button

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.login(email, password);
      //console.log(response);

      dispatch(setUser(response.user));
      setSuccess('Login successful!');
      setErrors([]);

      navigate('/home');
    } catch (error: any) {
      setErrors(error.response?.data?.message ? [error.response.data.message] : ['An error occurred']);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log('Google login successful. Credential:', credentialResponse);
      const response = await api.googleLogin(credentialResponse.credential);

      console.log('Backend response:', response);
      dispatch(setUser(response.user));
      setSuccess('Google login successful!');
      setErrors([]);

      navigate('/home');
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrors(error.response?.data?.message ? [error.response.data.message] : ['An error occurred during Google login']);
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-in error');
    setErrors(['Google sign-in was unsuccessful. Please try again.']);
  };

  return (
    <>
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center h-full overflow-hidden">
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

          {success && <p className="text-green-500 mb-4">{success}</p>}
          {errors.length > 0 && (
            <ul className="text-red-500 mb-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {/* Replaced with Material UI TextField for email input */}
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
            </div>
            <div className="mb-4">
              {/* Replaced with Material UI TextField for password input */}
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
            </div>

            {/* Material UI Button for the login */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }} // Adds margin-top for spacing
            >
              Connect Now
            </Button>
          </form>

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
