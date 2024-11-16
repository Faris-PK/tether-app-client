import ForgotPassword from '@/components/ForgotPassword'
import LeftSection from '@/components/LeftSection'
import React from 'react'

const ForgotPasswordPage: React.FC = () => {
  return (
    <>

<div className="flex flex-col md:flex-row h-screen font-montserrat">
      <LeftSection 
        title="Welcome back to" 
        subtitle="Tether" 
        description="Sign in to access your account"
        className="hidden md:flex"
      />
    <ForgotPassword/>
    </div>
    </>
    
  )
}

export default ForgotPasswordPage