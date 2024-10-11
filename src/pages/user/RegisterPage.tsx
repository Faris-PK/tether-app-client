import React from 'react'
import Register from '../../components/Register'
import LeftSection from '../../components/LeftSection'

const RegisterPage : React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen font-montserrat">
      <LeftSection 
        title="See what" 
        subtitle="it's happening now" 
        description="Sign up for Tether today"
        className="hidden md:flex"
      />
      <Register/>
    </div>
  )
}

export default RegisterPage