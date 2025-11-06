import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import EmailUpdateVerificationModal from './EmailUpdateVerificationModal'; // ✅ SAME FOLDER

const EmailSettings = ({ user, onUpdate }) => {
  const [emailData, setEmailData] = useState({
    newEmail: '',
    currentPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Send email update request with password verification
      const response = await fetch('http://localhost:5000/api/users/email/request-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          newEmail: emailData.newEmail,
          currentPassword: emailData.currentPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        setVerificationCode(result.code); // Store the 4-digit code
        setShowVerification(true);
        setMessage({ 
          type: 'success', 
          text: `4-digit verification code sent! ${result.code ? `Code: ${result.code}` : 'Check your email.'}`
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send verification code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

const handleVerification = async (code) => {
  setIsLoading(true);
  setMessage({ type: '', text: '' });

  try {
    const response = await fetch('http://localhost:5000/api/users/email/verify-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        newEmail: emailData.newEmail,
        code: code
      })
    });

    const result = await response.json();

    if (response.ok) {
      setMessage({ type: 'success', text: result.message || 'Email updated successfully!' });
      setShowVerification(false);
      setEmailData({ newEmail: '', currentPassword: '' });
      
      // ✅ REAL-TIME UPDATE - Update context immediately
      onUpdate(); // This should refresh the user context
      
      // ✅ FORCE UI UPDATE - Update the current email display
      setTimeout(() => {
        // This will make the current email field show the new email
        window.dispatchEvent(new Event('userUpdated'));
      }, 100);
      
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    setMessage({ type: 'error', text: error.message || 'Email update failed' });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Message */}
        {message.text && (
          <div className={`p-3 rounded-lg ${
            message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Current Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={user?.email}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              readOnly
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">New Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={emailData.newEmail}
              onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              placeholder="new@email.com"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={emailData.currentPassword}
              onChange={(e) => setEmailData({...emailData, currentPassword: e.target.value})}
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              placeholder="Enter current password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !emailData.newEmail || !emailData.currentPassword}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Code...</span>
            </>
          ) : (
            <>
              <FaCheck />
              <span>Send 4-Digit Code</span>
            </>
          )}
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            <strong>Email Update:</strong> 4-digit verification code required. 
            Password verification ensures account security.
          </p>
        </div>
      </form>

      {/* 4-Digit Verification Modal */}
      {showVerification && (
        <EmailUpdateVerificationModal
          email={emailData.newEmail}
          code={verificationCode}
          onVerify={handleVerification}
          onClose={() => setShowVerification(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default EmailSettings;