import React from 'react'

interface AuthFormProps {
    type: 'sign-in' | 'sign-up'
}

const AuthForm = ({ type }: AuthFormProps) => {
  return (
    <div>
      {type === 'sign-in' ? 'Sign In Form' : 'Sign Up Form'}
    </div>
  )
}

export default AuthForm