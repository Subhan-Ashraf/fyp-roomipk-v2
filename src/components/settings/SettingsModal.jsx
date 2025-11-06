import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import SettingsSidebar from './SettingsSidebar';
import ProfileSettings from './ProfileSettings';
import EmailSettings from './EmailSettings';
import PasswordSettings from './PasswordSettings';
import HostelSettings from './HostelSettings';
import ModalPortal from '../common/ModalPortal';


const SettingsModal = ({ isOpen, onClose, user, onUpdate, initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reset to initial tab when modal reopens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings user={user} onUpdate={onUpdate} />;
      case 'email':
        return <EmailSettings user={user} onUpdate={onUpdate} />;
      case 'password':
        return <PasswordSettings user={user} onUpdate={onUpdate} />;
      case 'hostel':
        return <HostelSettings user={user} onUpdate={onUpdate} />;
      default:
        return <ProfileSettings user={user} onUpdate={onUpdate} />;
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        {/* Single fixed size container - no changes on tab switch */}
        <div className="bg-white rounded-2xl shadow-2xl w-[900px] h-[600px] flex">
          {/* Sidebar - Fixed */}
          <div className="w-64 bg-gray-50 rounded-l-2xl p-6 border-r border-gray-200">
            <SettingsSidebar 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              user={user} 
            />
          </div>

          {/* Main Content - Fixed */}
          <div className="flex-1 flex flex-col">
            {/* Header - Fixed */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeTab === 'profile' && 'Profile Settings'}
                  {activeTab === 'email' && 'Email Settings'}
                  {activeTab === 'password' && 'Password Settings'}
                  {activeTab === 'hostel' && 'Hostel Settings'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {activeTab === 'profile' && 'Update your personal information'}
                  {activeTab === 'email' && 'Change your email address'}
                  {activeTab === 'password' && 'Update your password'}
                  {activeTab === 'hostel' && 'Manage your hostel listings'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Content Area - Fixed with scrolling */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default SettingsModal;