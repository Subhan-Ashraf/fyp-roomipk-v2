import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useUser } from '../../context/UserContext'
import { API_BASE_URL } from '../../utils/config'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import VerificationModal from './VerificationModal'
import ModalPortal from '../common/ModalPortal'

const AuthModal = ({ type, onClose, onSwitch }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userFormData, setUserFormData] = useState(null)
  const [error, setError] = useState('')
  const { login } = useUser()

  if (!type) return null

  const handleLogin = async (formData) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        login(result.user, result.token)
        onClose()
      } else {
        // Generic error message that doesn't reveal if username exists
        setError('Invalid credentials')
      }
    } catch (error) {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (formData) => {
    setIsLoading(true)
    setError('')
    try {
      // Store form data for verification
      setUserFormData(formData)
      
      const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const result = await response.json();

      if (response.ok) {
        setUserEmail(formData.email)
        setShowVerification(true)
      } else {
        setError(result.error || 'Failed to send verification code')
      }
    } catch (error) {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (code) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-and-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          code: code,
          userData: userFormData
        })
      });

      const result = await response.json();

      if (response.ok) {
        login(result.user, result.token)
        setShowVerification(false)
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setError(error.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error)
      }
    } catch (error) {
      setError(error.message || 'Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col transform transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === 'login' ? 'Welcome Back!' : 'Join Roomi.pk'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {type === 'login' ? (
            <LoginForm 
              onSubmit={handleLogin}
              onSwitch={onSwitch}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm 
              onSubmit={handleSignup}
              onSwitch={onSwitch}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

        {/* Verification Modal */}
        {showVerification && (
          <VerificationModal
            email={userEmail}
            onVerify={handleVerification}
            onClose={() => setShowVerification(false)}
            onResend={handleResendCode}
          />
        )}
      </div>
    </ModalPortal>
  )
}

export default AuthModal