import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaVenusMars, FaBirthdayCake, FaTimes, FaHome, FaInfoCircle } from 'react-icons/fa';
import ModalPortal from '../common/ModalPortal'

const UpgradeToOwnerModal = ({ isOpen, onClose, onUpgrade, isLoading, user }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form with existing profile data
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        fullName: user.profile.fullName || '',
        phone: user.profile.phone || '',
        age: user.profile.age || '',
        gender: user.profile.gender || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpgrade(formData);
    }
  };

  // Check if field is pre-filled from profile
  const isPreFilled = (fieldName) => {
    return user?.profile && user.profile[fieldName];
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Become a Hostel Owner</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Full Name</span>
                  {isPreFilled('fullName') && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <FaInfoCircle /> Pre-filled from profile
                    </span>
                  )}
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                      isPreFilled('fullName') 
                        ? 'bg-gray-50 border-gray-300 text-gray-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter your full name"
                    required
                    disabled={isPreFilled('fullName') || isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-600 text-xs font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Age and Gender in same row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Age</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                        isPreFilled('age') 
                          ? 'bg-gray-50 border-gray-300 text-gray-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Age"
                      min="18"
                      max="100"
                      required
                      disabled={isPreFilled('age') || isLoading}
                    />
                  </div>
                  {errors.age && (
                    <p className="text-red-600 text-xs font-medium">{errors.age}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <div className="mt-1">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                        isPreFilled('gender') 
                          ? 'bg-gray-50 border-gray-300 text-gray-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      required
                      disabled={isPreFilled('gender') || isLoading}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-red-600 text-xs font-medium">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                      isPreFilled('phone') 
                        ? 'bg-gray-50 border-gray-300 text-gray-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="+92 300 1234567"
                    required
                    disabled={isPreFilled('phone') || isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-xs font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Current Email (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Verification Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    readOnly
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500">
                  We'll send a verification code to this email for security
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaHome />
                  <span>Become Hostel Owner</span>
                </>
              )}
            </button>

            {/* Info Text */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              Pre-filled information from your profile cannot be modified here. 
              To update these details, please use the Profile Settings.
            </p>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default UpgradeToOwnerModal;