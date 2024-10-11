import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { api } from '../api/userApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import Button from '@mui/material/Button';

interface RegisterFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

const Register: React.FC = () => {
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormState>();

  const onSubmit: SubmitHandler<RegisterFormState> = async (data: RegisterFormState) => {
    if (data.password !== data.confirmPassword) {
      return;
    }

    try {
      await api.register({
        username: data.username,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });

      setSuccess('Registration successful!');
      navigate('/user/otp', { state: { email: data.email } });
    } catch (error: any) {
      console.error('Registration error:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.googleRegister(credentialResponse.credential);
      setSuccess('Google signup successful!');
      dispatch(setUser(response.user));
      navigate('/user/home');
    } catch (error: any) {
      console.error('Google signup error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-up error');
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const password = watch('password');

  return (
    <>
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md p-6">
          <div className="flex justify-end mb-4">
            <p className="text-black font-medium mr-2">Already Have an Account?</p>
            <Link to="/user/signin" className="text-[#1D9BF0] font-black hover:text-[#2589cc] transition duration-200">
              Sign In
            </Link>
          </div>
          <h2 className="text-3xl font-bold mb-2">Discover what's trending</h2>
          <p className="font-bold text-gray-500 mb-2">Sign Up to Tether</p>

          {success && <p className="text-green-500 mb-4">{success}</p>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field */}
            <div className="mb-2">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                {...register('username', { required: 'Username is required' })}
              />
              {errors.username && <FormHelperText error>{errors.username.message}</FormHelperText>}
            </div>

            {/* Email Field */}
            <div className="mb-2">
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' },
                })}
              />
              {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </div>

            {/* Password Field */}
            <div className="mb-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
              </FormControl>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: (value: string) => value === password || 'Passwords do not match',
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
                {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
              </FormControl>
            </div>

            {/* Mobile Field */}
            <div className="mb-2">
              <TextField
                label="Mobile"
                type="tel"
                variant="outlined"
                fullWidth
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Mobile number must be 10 digits',
                  },
                })}
              />
              {errors.mobile && <FormHelperText error>{errors.mobile.message}</FormHelperText>}
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign Up
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
              text="signup_with"
              shape="rectangular"
              logo_alignment="left"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
