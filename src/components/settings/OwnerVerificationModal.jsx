import React, { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope, FaClock, FaCheck, FaRedo, FaShieldAlt } from 'react-icons/fa';

const OwnerVerificationModal = ({ email, onVerify, onClose, onResend, isLoading }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`owner-verification-input-${index + 1}`).focus();
    }

    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`owner-verification-input-${index - 1}`).focus();
    }
  };

  const handleVerify = async (verificationCode = code.join('')) => {
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    await onVerify(verificationCode);
  };

  const handleResend = async () => {
    setError('');
    await onResend();
    setTimeLeft(480);
    setCanResend(false);
    setCode(['', '', '', '', '', '']);
    document.getElementById('owner-verification-input-0').focus();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FaShieldAlt className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Security Verification</h2>
              <p className="text-sm text-gray-600 mt-1">Verify your identity to become a hostel owner</p>
            </div>
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

          {/* Timer */}
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
              Enter 6-digit security code
            </label>
            
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`owner-verification-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>Verify & Upgrade</span>
                </>
              )}
            </button>

            {/* Resend Code */}
            <div className="text-center space-y-2">
              {timeLeft > 0 ? (
                <p className="text-gray-500 text-sm">
                  Didn't receive code? Resend in {formatTime(timeLeft)}
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <FaRedo className="text-sm" />
                  <span>Resend verification code</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-600 text-center">
            This extra security step ensures only verified users can become hostel owners
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerVerificationModal;