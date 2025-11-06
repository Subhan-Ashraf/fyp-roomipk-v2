import React, { useState } from 'react';
import { FaIdCard, FaBuilding, FaCheck, FaTimes, FaUpload, FaClock } from 'react-icons/fa';

const HostelDocumentation = ({ user, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [docData, setDocData] = useState({
    idType: user?.hostelOwnerInfo?.documentation?.idType || '',
    idNumber: user?.hostelOwnerInfo?.documentation?.idNumber || '',
    idFront: null,
    idBack: null,
    businessProof: null
  });

  const handleFileUpload = (field, file) => {
    // Simulate file upload - in real app, upload to cloud storage
    setDocData(prev => ({
      ...prev,
      [field]: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Implement document submission
      setMessage({ type: 'success', text: 'Documents submitted for verification!' });
      
      // Simulate API call
      setTimeout(() => {
        onUpdate(); // Refresh user data
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Submission failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    const status = user?.hostelOwnerInfo?.documentation?.status;
    switch (status) {
      case 'verified':
        return { color: 'green', text: 'Verified', icon: FaCheck };
      case 'rejected':
        return { color: 'red', text: 'Rejected', icon: FaTimes };
      default:
        return { color: 'yellow', text: 'Pending Review', icon: FaClock };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Status Banner */}
      <div className={`bg-${statusBadge.color}-50 border border-${statusBadge.color}-200 rounded-lg p-4`}>
        <div className="flex items-center space-x-3">
          <StatusIcon className={`text-${statusBadge.color}-600 text-lg`} />
          <div>
            <h3 className={`text-${statusBadge.color}-800 font-semibold`}>
              Verification Status: {statusBadge.text}
            </h3>
            <p className={`text-${statusBadge.color}-700 text-sm mt-1`}>
              {statusBadge.text === 'verified' 
                ? 'Your documents have been verified. You can now list hostels.'
                : statusBadge.text === 'rejected'
                ? 'Please review and resubmit your documents.'
                : 'Your documents are under review. This may take 1-2 business days.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Documentation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ID Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <FaIdCard className="text-blue-500" />
            <span>Identification Type *</span>
          </label>
          <select
            value={docData.idType}
            onChange={(e) => setDocData({...docData, idType: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            disabled={isLoading}
          >
            <option value="">Select ID Type</option>
            <option value="cnic">CNIC (National ID)</option>
            <option value="passport">Passport</option>
            <option value="driver_license">Driver's License</option>
          </select>
        </div>

        {/* ID Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ID Number *</label>
          <input
            type="text"
            value={docData.idNumber}
            onChange={(e) => setDocData({...docData, idNumber: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your ID number"
            required
            disabled={isLoading}
          />
        </div>

        {/* ID Front Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ID Front Photo *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <FaUpload className="text-gray-400 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload front side of your ID</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('idFront', e.target.files[0])}
              className="hidden"
              id="idFront"
              required
              disabled={isLoading}
            />
            <label 
              htmlFor="idFront"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
            {docData.idFront && (
              <p className="text-green-600 text-sm mt-2">✓ File selected</p>
            )}
          </div>
        </div>

        {/* ID Back Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ID Back Photo *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <FaUpload className="text-gray-400 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload back side of your ID</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('idBack', e.target.files[0])}
              className="hidden"
              id="idBack"
              required
              disabled={isLoading}
            />
            <label 
              htmlFor="idBack"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
            {docData.idBack && (
              <p className="text-green-600 text-sm mt-2">✓ File selected</p>
            )}
          </div>
        </div>

        {/* Business Proof Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <FaBuilding className="text-green-500" />
            <span>Business Proof (Optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <FaUpload className="text-gray-400 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Business registration, utility bill, or rental agreement
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload('businessProof', e.target.files[0])}
              className="hidden"
              id="businessProof"
              disabled={isLoading}
            />
            <label 
              htmlFor="businessProof"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
            {docData.businessProof && (
              <p className="text-green-600 text-sm mt-2">✓ File selected</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !docData.idType || !docData.idNumber || !docData.idFront || !docData.idBack}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting Documents...</span>
            </>
          ) : (
            <>
              <FaCheck />
              <span>Submit for Verification</span>
            </>
          )}
        </button>
      </form>

      {/* Information Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Why we need this information:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Verify your identity as a legitimate hostel owner</li>
          <li>• Ensure guest safety and trust</li>
          <li>• Comply with local regulations</li>
          <li>• Process payments securely</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Your documents are stored securely and only used for verification purposes.
        </p>
      </div>
    </div>
  );
};

export default HostelDocumentation;