import LeftSection from '@/components/LeftSection'
import ResetPassword from '@/components/ResetPassword'
import React from 'react'

const ResetPasswordPage:React.FC = () => {
  return (


    <>

    <div className="flex flex-col md:flex-row h-screen font-montserrat">
          <LeftSection 
            title="Welcome back to" 
            subtitle="Tether" 
            description="Sign in to access your account"
            className="hidden md:flex"
          />
        <ResetPassword/>
        </div>
        </>

  )
}

export default ResetPasswordPage