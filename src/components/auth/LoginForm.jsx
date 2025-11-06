import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { validateEmail, validateUsername } from '../../utils/validation'

const LoginForm = ({ onSubmit, onSwitch, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [validation, setValidation] = useState({
    username: { isValid: false, message: '' },
    password: { isValid: false, message: '' }
  })

  useEffect(() => {
    // Validate username/email in real-time
    const usernameValidation = formData.username.includes('@') 
      ? validateEmail(formData.username)
      : validateUsername(formData.username)
    
    setValidation(prev => ({
      ...prev,
      username: usernameValidation,
      password: { 
        isValid: formData.password.length > 0, 
        message: formData.password ? '✓' : 'Password is required' 
      }
    }))
  }, [formData])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validation.username.isValid && formData.password) {
      onSubmit(formData)
    }
  }

  const isFormValid = validation.username.isValid && formData.password

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Username or Email</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
              formData.username ? 
                validation.username.isValid ? 
                  'border-green-500 focus:border-green-500' : 
                  'border-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter your username or email"
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
              formData.password ? 
                'border-green-500 focus:border-green-500' : 
                'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {formData.password && (
          <p className="text-xs font-medium text-green-600">
            {validation.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Logging in...
          </>
        ) : (
          'Login to Roomi.pk'
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  )
}

export default LoginForm