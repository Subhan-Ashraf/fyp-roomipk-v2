import React, { useState, useRef, useEffect } from 'react'
import { FaUser, FaHeart, FaCog, FaSignOutAlt, FaChevronDown, FaHome, FaBuilding } from 'react-icons/fa'
import { useUser } from '../../context/UserContext'

const ProfileDropdown = ({ onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, logout } = useUser()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U'
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-full px-4 py-2 hover:bg-white hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md group"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm transform group-hover:scale-105 transition-transform duration-300 shadow-md">
          {getInitials(user.username)}
        </div>
        
        {/* Username - Hidden on mobile */}
        <span className="text-gray-700 font-medium text-sm hidden sm:block group-hover:text-gray-900 transition-colors duration-300">
          {user.username}
        </span>
        
        {/* Dropdown Icon */}
        <FaChevronDown className={`text-gray-500 text-xs transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-blue-600'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-2 duration-300 origin-top">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {getInitials(user.username)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                <div className="mt-1.5">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.userType === 'hostel_owner' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.userType === 'hostel_owner' ? '🏠 Owner' : '🎓 Student'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <DropdownItem 
              icon={<FaHome className="text-blue-500" />}
              label="Dashboard"
              onClick={() => {
                setIsOpen(false)
                console.log('Navigate to dashboard')
              }}
            />
            
            <DropdownItem 
              icon={<FaUser className="text-purple-500" />}
              label="My Profile"
              onClick={() => {
                setIsOpen(false)
                console.log('Navigate to profile')
              }}
            />

            {user.userType === 'hostel_owner' && (
              <DropdownItem 
                icon={<FaBuilding className="text-green-500" />}
                label="My Hostels"
                onClick={() => {
                  setIsOpen(false)
                  console.log('Navigate to hostels')
                }}
              />
            )}
            
            <DropdownItem 
              icon={<FaHeart className="text-pink-500" />}
              label="Saved Hostels"
              onClick={() => {
                setIsOpen(false)
                console.log('Navigate to saved hostels')
              }}
            />
            
            <DropdownItem 
              icon={<FaCog className="text-gray-500" />}
              label="Settings"
              onClick={() => {
                setIsOpen(false)
                onSettingsClick()
              }}
            />

            {/* Divider */}
            <div className="border-t border-gray-100/50 my-1"></div>

            <DropdownItem 
              icon={<FaSignOutAlt className="text-red-500" />}
              label="Logout"
              onClick={handleLogout}
              isDanger={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Dropdown Item Component
const DropdownItem = ({ icon, label, onClick, isDanger = false }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-all duration-200 group relative overflow-hidden rounded-lg mx-2 ${
        isDanger 
          ? 'hover:bg-red-50 text-red-600' 
          : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 rounded-lg transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
        isDanger ? 'bg-red-50' : 'bg-gray-50'
      }`}></div>
      
      {/* Icon */}
      <div className={`transform group-hover:scale-110 transition-transform duration-200 relative z-10 ${
        isDanger ? 'text-red-500' : ''
      }`}>
        {icon}
      </div>
      
      {/* Label */}
      <span className={`text-sm font-medium transition-colors duration-200 relative z-10 ${
        isDanger 
          ? 'text-red-600 group-hover:text-red-700' 
          : 'text-gray-700 group-hover:text-gray-900'
      }`}>
        {label}
      </span>
    </button>
  )
}

export default ProfileDropdown