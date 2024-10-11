import React from 'react'
import SignIn from '../../components/SignIn'
import LeftSection from '../../components/LeftSection'

const SignInPage:React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen font-montserrat">
      <LeftSection 
        title="Welcome back to" 
        subtitle="Tether" 
        description="Sign in to access your account"
        className="hidden md:flex"
      />
    <SignIn/>
    </div>
  )
}

export default SignInPage