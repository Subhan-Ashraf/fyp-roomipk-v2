import React, { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope, FaClock, FaCheck } from 'react-icons/fa';

const EmailUpdateVerificationModal = ({ email, code, onVerify, onClose, isLoading }) => {
  const [inputCode, setInputCode] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [error, setError] = useState('');

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...inputCode];
    newCode[index] = value;
    setInputCode(newCode);

    if (value && index < 3) {
      document.getElementById(`email-update-input-${index + 1}`).focus();
    }

    if (newCode.every(digit => digit !== '') && index === 3) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !inputCode[index] && index > 0) {
      document.getElementById(`email-update-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedCode = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (pastedCode.length === 4) {
      const newCode = pastedCode.split('');
      setInputCode(newCode);
      
      setTimeout(() => {
        handleVerify(pastedCode);
      }, 100);
    }
  };

  const handleVerify = async (verificationCode = inputCode.join('')) => {
    if (verificationCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setError('');
    await onVerify(verificationCode);
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
              <FaEnvelope className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Email Update</h2>
              <p className="text-sm text-gray-600 mt-1">Enter the 4-digit code</p>
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

          {/* Development Helper - Show Code */}
          {code && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-700 text-center">
                <strong>Development Mode:</strong> Use this code: <span className="font-mono font-bold">{code}</span>
              </p>
            </div>
          )}

          {/* Timer */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <FaClock className={`text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-gray-500 text-sm">remaining</span>
          </div>

          {/* 4-Digit Code Inputs */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Enter 4-digit verification code
            </label>
            
            <div className="flex justify-center space-x-4">
              {inputCode.map((digit, index) => (
                <input
                  key={index}
                  id={`email-update-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e)}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
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
              disabled={isLoading || timeLeft <= 0 || inputCode.some(digit => digit === '')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Email...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>Verify & Update Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-600 text-center">
            Check your email for the 4-digit verification code
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailUpdateVerificationModal;