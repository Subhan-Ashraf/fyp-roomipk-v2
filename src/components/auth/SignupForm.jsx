import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'
import { validateEmail, validateUsername, validatePassword, validateConfirmPassword } from '../../utils/validation'

const SignupForm = ({ onSubmit, onSwitch, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [validation, setValidation] = useState({
    username: { isValid: false, message: '' },
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '', strength: '' },
    confirmPassword: { isValid: false, message: '' }
  })

  useEffect(() => {
    setValidation({
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    })
  }, [formData])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const isFormValid = Object.values(validation).every(field => field.isValid)
    
    if (isFormValid) {
      onSubmit(formData) // Pass the complete form data
    } else {
      // Show first error message
      const firstError = Object.values(validation).find(field => !field.isValid)
      alert(firstError?.message || 'Please fix the form errors')
    }
  }

  const isFormValid = Object.values(validation).every(field => field.isValid)

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          <FaUser className="text-sm" />
          <span className="text-sm font-medium">Registering as Simple User</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          You can upgrade to Hostel Owner later from your profile
        </p>
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition ${
              formData.username ? 
                validation.username.isValid ? 
                  'border-green-500 focus:border-green-500 focus:ring-green-200' : 
                  'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
            placeholder="Choose a username"
            required
            disabled={isLoading}
          />
        </div>
        {formData.username && (
          <p className={`text-xs font-medium ${
            validation.username.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validation.username.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition ${
              formData.email ? 
                validation.email.isValid ? 
                  'border-green-500 focus:border-green-500 focus:ring-green-200' : 
                  'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>
        {formData.email && (
          <p className={`text-xs font-medium ${
            validation.email.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validation.email.message}
          </p>
        )}
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 transition ${
                formData.password ? 
                  validation.password.isValid ? 
                    'border-green-500 focus:border-green-500 focus:ring-green-200' : 
                    'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Confirm</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 transition ${
                formData.confirmPassword ? 
                  validation.confirmPassword.isValid ? 
                    'border-green-500 focus:border-green-500 focus:ring-green-200' : 
                    'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      <div className="space-y-2">
        {formData.password && (
          <div className="space-y-1">
            <p className={`text-xs font-medium ${
              validation.password.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {validation.password.message}
            </p>
            {/* Password Strength Bar */}
            {formData.password && (
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    getStrengthColor(validation.password.strength)
                  }`}
                  style={{ 
                    width: validation.password.strength === 'strong' ? '100%' :
                           validation.password.strength === 'good' ? '75%' :
                           validation.password.strength === 'fair' ? '50%' : '25%'
                  }}
                ></div>
              </div>
            )}
          </div>
        )}
        
        {formData.confirmPassword && (
          <p className={`text-xs font-medium ${
            validation.confirmPassword.isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validation.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Password Toggle */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          disabled={isLoading}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
          <span>{showPassword ? 'Hide' : 'Show'} Passwords</span>
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Creating Account...
          </>
        ) : (
          'Create Account & Verify Email'
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            disabled={isLoading}
          >
            Login
          </button>
        </p>
      </div>
    </form>
  )
}

export default SignupForm