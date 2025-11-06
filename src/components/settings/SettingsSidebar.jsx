import React from 'react';
import { FaUser, FaEnvelope, FaLock, FaHome, FaLockOpen } from 'react-icons/fa';

const SettingsSidebar = ({ activeTab, onTabChange, user }) => {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser, available: true },
    { id: 'email', label: 'Email', icon: FaEnvelope, available: true },
    { id: 'password', label: 'Password', icon: FaLock, available: true },
    { 
      id: 'hostel', 
      label: 'Hostel Settings', 
      icon: FaHome, 
      available: user?.userType === 'hostel_owner' 
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Settings</h3>
      <nav className="space-y-2 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isAvailable = tab.available;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => isAvailable && onTabChange(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                  : isAvailable 
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isAvailable}
            >
              <Icon className={`text-sm ${isActive ? 'text-blue-600' : ''}`} />
              <span className="font-medium">{tab.label}</span>
              {!isAvailable && <FaLock className="text-xs ml-auto" />}
            </button>
          );
        })}
      </nav>
      
      {/* User Info Footer */}
      <div className="pt-6 border-t border-gray-200 mt-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.userType?.replace('_', ' ') || 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;