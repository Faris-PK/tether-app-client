import React from 'react'
import OTP from '../../components/Otp'
import LeftSection from '../../components/LeftSection'

const OtpPage:React.FC =  () => {
  return (
    <div className="flex flex-col md:flex-row h-screen font-montserrat">
      <LeftSection 
        title="See what" 
        subtitle="it's happening now" 
        description="Sign up for Tether today" 
        className="hidden md:flex w-1/2"
      />
      <OTP/>
    </div>

  )
}

export default OtpPage