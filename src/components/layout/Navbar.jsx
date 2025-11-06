import React, { useState } from 'react'
import { FaMapMarkerAlt, FaUser, FaHome } from 'react-icons/fa'
import { useUser } from '../../context/UserContext'
import ProfileDropdown from '../profile/ProfileDropdown'
import UpgradeToOwnerModal from '../settings/UpgradeToOwnerModal'
import OwnerVerificationModal from '../settings/OwnerVerificationModal'
import SettingsModal from '../settings/SettingsModal' // ✅ UPDATED PATH


const Navbar = ({ onAuthClick }) => {
  const { user, loading } = useUser()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [upgradeData, setUpgradeData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleUpgradeClick = () => {
    if (!user) {
      onAuthClick('login')
      return
    }
    setShowUpgradeModal(true)
  }

  const handleUpgradeSubmit = async (formData) => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      // Store the form data for after verification
      setUpgradeData(formData)
      
      // First, send verification code
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      });

      const result = await response.json();

      if (response.ok) {
        setShowUpgradeModal(false)
        setShowVerificationModal(true)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send verification code' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (code) => {
    setIsLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await fetch('/api/users/upgrade-to-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...upgradeData,
          code: code
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Successfully upgraded to hostel owner! 🎉' })
        setShowVerificationModal(false)
        
        // Refresh the page to update user context
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Upgrade failed' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to resend code' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingsClick = () => {
    setShowSettingsModal(true)
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="w-full flex justify-between items-center">
          {/* Far Left - Rounded Logo Skeleton */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Far Right - Auth Buttons Skeleton */}
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="bg-white shadow-sm py-3 px-6 sticky top-0 z-10 backdrop-blur-sm bg-white/95 border-b border-gray-100">
        <div className="w-full flex justify-between items-center">
          
          {/* FAR LEFT - Rounded Compact Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            {/* Rounded Logo Container */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <FaMapMarkerAlt className="text-white text-lg transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              
              {/* Optional: Add a subtle pulse effect on hover */}
              <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 animate-ping transition-opacity duration-300"></div>
            </div>
            
            {/* Text Logo - More compact */}
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              Roomi.pk
            </span>
          </div>

          {/* FAR RIGHT - Auth Buttons or Profile Dropdown */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 animate-in slide-in-from-right-8 duration-500">
                {/* Hostel Owner Button - Only show if user is not already an owner */}
                {user.userType !== 'hostel_owner' && (
                  <button 
                    onClick={handleUpgradeClick}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-5 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group flex items-center space-x-2 text-sm"
                  >
                    <FaHome className="text-xs" />
                    <span className="relative z-10">Become Owner</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                )}
                
                {/* Profile Dropdown - PASS THE SETTINGS HANDLER */}
                <div className="animate-in slide-in-from-right-8 duration-500">
                  <ProfileDropdown onSettingsClick={handleSettingsClick} />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 animate-in slide-in-from-right-8 duration-500">
                <button 
                  onClick={() => onAuthClick('login')}
                  className="text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium flex items-center space-x-2 group relative overflow-hidden px-4 py-2 rounded-lg hover:bg-blue-50 text-sm"
                >
                  <FaUser className="text-xs transform group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative">
                    Login
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </button>
                <button 
                  onClick={() => onAuthClick('signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden group text-sm"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Upgrade to Owner Modal */}
      <UpgradeToOwnerModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgradeSubmit}
        isLoading={isLoading}
        user={user}
      />

      {/* Owner Verification Modal */}
      {showVerificationModal && (
        <OwnerVerificationModal
          email={user?.email}
          onVerify={handleVerification}
          onClose={() => setShowVerificationModal(false)}
          onResend={handleResendCode}
          isLoading={isLoading}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
        onUpdate={() => {
          // refresh or handle updates after settings change
          console.log('Settings updated - refresh user data if needed')
        }}
      />

      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{message.text}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar