import React, { useState } from 'react';
import { FaHome, FaIdCard, FaCheck, FaLock, FaArrowRight } from 'react-icons/fa';
import HostelDocumentation from './HostelDocumentation';

const HostelSettings = ({ user, onUpdate }) => {
  const [activeSection, setActiveSection] = useState('overview');

  // If user hasn't submitted docs, show documentation form
  if (!user?.hostelOwnerInfo?.documentation?.submittedAt) {
    return <HostelDocumentation user={user} onUpdate={onUpdate} />;
  }

  // If docs are pending/rejected, show status
  if (user.hostelOwnerInfo.documentation.status !== 'verified') {
    return <HostelDocumentation user={user} onUpdate={onUpdate} />;
  }

  // If verified, show hostel management options
  return (
    <div className="max-w-2xl">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-white text-xl" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Verified Hostel Owner
        </h3>
        
        <p className="text-gray-600 mb-6">
          Your account is fully verified! You can now manage your hostel listings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left">
            <FaHome className="text-xl mb-2" />
            <h4 className="font-semibold">Add New Hostel</h4>
            <p className="text-sm opacity-90">List your first hostel property</p>
          </button>

          <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left">
            <FaIdCard className="text-xl mb-2" />
            <h4 className="font-semibold">Manage Hostels</h4>
            <p className="text-sm opacity-90">View and edit your listings</p>
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            <strong>Status:</strong> You can list up to {user.hostelOwnerInfo.maxHostelsAllowed} hostels
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostelSettings;