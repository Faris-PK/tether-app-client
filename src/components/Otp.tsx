import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/userApi';

const OTP: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || { email: "" }; 
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.verifyOtp(email, otp.join(''));
      setSuccess('OTP verified successfully!');
      setErrors('');
      navigate('/signin');
    } catch (error: any) {
      setErrors(error.response?.data.message );
      console.log('Error from frontend : ', error.response?.data.message );
      
    }
  };

  return (
   <>
      
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md p-6">
          <h2 className="text-3xl font-bold mb-2">Enter OTP</h2>
          <p className="font-bold text-gray-500 mb-2">We have sent an OTP to {email}</p>

          {/* {success && <p className="text-green-500 mb-4">{success}</p>}
          {errors.length > 0 && (
            <ul className="text-red-500 mb-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )} */}

          <form onSubmit={handleSubmit}>
            <div className="flex space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="w-10 h-10 text-center border border-gray-300 rounded"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {errors && 
            <p className="text-red-500">{errors}</p>
            }
            <button
              type="submit"
              className="font-medium mt-6 w-full bg-[#1D9BF0] text-white py-2 rounded-sm hover:bg-[#2589cc] transition duration-200"
            >
              Verify OTP
            </button>
          </form>

          <div className="flex justify-between mt-4">
            
           {timeLeft==0 ? <p className="text-red-500">OTP Expired </p> :
           <p className="text-yellow-500">OTP will expire in {formatTime(timeLeft)}</p>
           }
            {timeLeft === 0 && (
              <button className="text-[#1D9BF0] hover:underline" onClick={() => {}}>
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
      </>
  );
};

export default OTP;
