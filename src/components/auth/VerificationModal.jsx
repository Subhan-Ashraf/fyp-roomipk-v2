import React, { useState, useEffect } from 'react'
import { FaTimes, FaEnvelope, FaClock, FaCheck, FaRedo } from 'react-icons/fa'
import ModalPortal from '../common/ModalPortal'

const VerificationModal = ({ email, onVerify, onClose, onResend }) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(480) // 8 minutes in seconds
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [canResend, setCanResend] = useState(false)

  // Single timer for expiration
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return // Only allow numbers

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`verification-input-${index + 1}`).focus()
    }

    // Auto-submit when all digits are entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`verification-input-${index - 1}`).focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedCode = pastedData.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    
    if (pastedCode.length === 6) {
      const newCode = pastedCode.split('');
      setCode(newCode);
      
      // Auto-submit after paste
      setTimeout(() => {
        handleVerify(pastedCode);
      }, 100);
    }
  }

  const handleVerify = async (verificationCode = code.join('')) => {
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      await onVerify(verificationCode)
      // Success - modal will close automatically
    } catch (err) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError('')
    try {
      await onResend()
      setTimeLeft(480) // Reset timer to 8 minutes
      setCanResend(false)
      setCode(['', '', '', '', '', ''])
      document.getElementById('verification-input-0').focus()
    } catch (err) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
            <p className="text-sm text-gray-600 mt-1">We sent a code to your email</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Email Display */}
          <div className="flex items-center justify-center space-x-3 bg-blue-50 rounded-lg p-4 mb-6">
            <FaEnvelope className="text-blue-600 text-lg" />
            <span className="font-medium text-blue-800">{email}</span>
          </div>

          {/* Single Timer */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <FaClock className={`text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-gray-500 text-sm">remaining</span>
          </div>

          {/* Code Inputs */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Enter 6-digit verification code
            </label>
            
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`verification-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  disabled={isLoading || timeLeft <= 0}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={isLoading || timeLeft <= 0 || code.some(digit => digit === '')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>Verify Email</span>
                </>
              )}
            </button>

            {/* Resend Code Section */}
            <div className="text-center space-y-2">
              {timeLeft > 0 ? (
                <p className="text-gray-500 text-sm">
                  Didn't receive code? Resend in {formatTime(timeLeft)}
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <FaRedo className="text-sm" />
                  <span>Resend verification code</span>
                </button>
              )}
            </div>

            {/* Expired Message */}
            {timeLeft <= 0 && (
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-red-700 text-sm">
                  Code expired. Please request a new one.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-600 text-center">
            Can't find the email? Check your spam folder or make sure you entered the correct email address.
          </p>
        </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default VerificationModal