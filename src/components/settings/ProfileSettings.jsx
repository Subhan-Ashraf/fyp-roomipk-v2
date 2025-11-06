import React, { useState, useEffect } from 'react';
import { FaUser, FaCheck, FaExclamationTriangle, FaPhone, FaEdit, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../utils/config';

const ProfileSettings = ({ user, onUpdate }) => {
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    fullName: user?.profile?.fullName || '',
    age: user?.profile?.age || '',
    gender: user?.profile?.gender || '',
    phone: user?.profile?.phone || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validation, setValidation] = useState({
    fullName: { isValid: true, message: '' },
    phone: { isValid: true, message: '' } // Add phone validation state
  });
  const [editingField, setEditingField] = useState(null); // Track which field is being edited

  const isHostelOwner = user?.userType === 'hostel_owner';

  // Validate full name format
  const validateFullName = (name) => {
    if (!name.trim()) {
      return { isValid: false, message: 'Full name is required' };
    }

    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      return { isValid: false, message: 'Please enter both first and last name' };
    }

    for (let part of nameParts) {
      if (part.length < 2) {
        return { isValid: false, message: 'Each name part should be at least 2 characters' };
      }
      
      if (!/^[A-Z][a-zA-Z]*$/.test(part)) {
        return { isValid: false, message: 'Names should start with capital letter and contain only letters' };
      }
      
      if (part.length > 20) {
        return { isValid: false, message: 'Name parts should not exceed 20 characters' };
      }
    }

    if (/(.)\1{3,}/.test(name)) {
      return { isValid: false, message: 'Please enter a valid name' };
    }

    if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(name)) {
      return { isValid: false, message: 'Name should contain only letters and spaces' };
    }

    return { isValid: true, message: '✓ Valid name format' };
  };

  // Optimize validation functions
  const validatePhone = (phone) => {
    if (!phone) return { isValid: true, message: '' }; // Allow empty for non-owners
    
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{9,15}$/; // Require at least 10 digits
    
    if (!phoneRegex.test(cleanPhone)) {
      return { 
        isValid: false, 
        message: 'Enter a valid phone number (10-15 digits)'
      };
    }
    
    return { isValid: true, message: '✓ Valid phone number' };
  };

  const handleFullNameChange = (value) => {
    setProfileData({...profileData, fullName: value});
    
    if (value) {
      const nameValidation = validateFullName(value);
      setValidation({...validation, fullName: nameValidation});
    } else {
      setValidation({...validation, fullName: { isValid: false, message: 'Full name is required' }});
    }
  };

  const startEditing = (fieldName) => {
    setEditingField(fieldName);
  };

  const cancelEditing = () => {
    setEditingField(null);
    // Reset to original values
    setProfileData({
      username: user?.username || '',
      fullName: user?.profile?.fullName || '',
      age: user?.profile?.age || '',
      gender: user?.profile?.gender || '',
      phone: user?.profile?.phone || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Final validation before submission
    if (profileData.fullName) {
      const nameValidation = validateFullName(profileData.fullName);
      if (!nameValidation.isValid) {
        setMessage({ type: 'error', text: nameValidation.message });
        setIsLoading(false);
        return;
      }
    }

    // Phone validation for hostel owners
    if (isHostelOwner && profileData.phone) {
      const phoneValidation = validatePhone(profileData.phone);
      if (!phoneValidation.isValid) {
        setMessage({ type: 'error', text: 'Please enter a valid phone number' });
        setIsLoading(false);
        return;
      }
    }

    // For hostel owners, validate required fields
    if (isHostelOwner) {
      if (!profileData.fullName || !profileData.age || !profileData.gender || !profileData.phone) {
        setMessage({ type: 'error', text: 'All fields are required for hostel owners' });
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
        setEditingField(null); // Exit edit mode
        onUpdate(); // Refresh user data
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Editable Field Component
  const EditableField = ({ label, value, fieldName, type = "text", required = false, options = [] }) => {
    const isEditing = editingField === fieldName;
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => startEditing(fieldName)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FaEdit className="text-sm" />
            </button>
          ) : (
            <button
              type="button"
              onClick={cancelEditing}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </label>
        
        {!isEditing ? (
          // Display mode
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
            {value || <span className="text-gray-400">Not set</span>}
          </div>
        ) : (
          // Edit mode
          <div className="relative">
            {type === "select" ? (
              <select
                value={profileData[fieldName]}
                onChange={(e) => setProfileData({...profileData, [fieldName]: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                required={required}
                disabled={isLoading}
              >
                <option value="">Select {label}</option>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={profileData[fieldName]}
                onChange={(e) => {
                  if (fieldName === 'fullName') {
                    handleFullNameChange(e.target.value);
                  } else {
                    setProfileData({...profileData, [fieldName]: e.target.value});
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 transition text-sm ${
                  fieldName === 'fullName' && profileData.fullName 
                    ? validation.fullName.isValid 
                      ? 'border-green-500 focus:ring-green-200' 
                      : 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder={`Enter ${label.toLowerCase()}`}
                required={required}
                disabled={isLoading}
              />
            )}
          </div>
        )}
        
        {/* Validation message for full name and phone */}
        {((fieldName === 'fullName' && profileData.fullName) || 
          (fieldName === 'phone' && profileData.phone)) && 
          isEditing && validation[fieldName] && (
          <p className={`text-xs font-medium flex items-center space-x-1 ${
            validation[fieldName].isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {validation[fieldName].isValid ? 
              <FaCheck className="text-xs" /> : 
              <FaExclamationTriangle className="text-xs" />
            }
            <span>{validation[fieldName].message}</span>
          </p>
        )}
      </div>
    );
  };

  // Combine validation in single useEffect
  useEffect(() => {
    const validateField = async () => {
      const updates = {};
      
      if (profileData.fullName) {
        updates.fullName = validateFullName(profileData.fullName);
      }
      
      if (profileData.phone || isHostelOwner) {
        updates.phone = validatePhone(profileData.phone);
      }
      
      if (Object.keys(updates).length > 0) {
        setValidation(prev => ({...prev, ...updates}));
      }
    };
    
    validateField();
  }, [profileData.fullName, profileData.phone, isHostelOwner]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message */}
      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Hostel Owner Notice */}
      {isHostelOwner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-blue-700">
            <FaExclamationTriangle className="text-sm" />
            <span className="text-sm font-medium">Hostel Owner Profile</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            All fields are required and visible to potential guests.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Username - Always editable */}
        <EditableField
          label="Username"
          value={profileData.username}
          fieldName="username"
          type="text"
        />

        {/* Full Name */}
        <EditableField
          label="Full Name"
          value={profileData.fullName}
          fieldName="fullName"
          type="text"
          required={isHostelOwner}
        />
      </div>

      <div className={`grid ${isHostelOwner ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
        {/* Age */}
        <EditableField
          label="Age"
          value={profileData.age}
          fieldName="age"
          type="number"
          required={isHostelOwner}
        />

        {/* Gender */}
        <EditableField
          label="Gender"
          value={profileData.gender}
          fieldName="gender"
          type="select"
          required={isHostelOwner}
          options={[
            { value: '', label: 'Select Gender' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]}
        />

        {/* Phone - Only for hostel owners */}
        {isHostelOwner && (
          <EditableField
            label="Phone"
            value={profileData.phone}
            fieldName="phone"
            type="tel"
            required={true}
          />
        )}
      </div>

      {/* Phone for Simple Users (Optional) */}
      {!isHostelOwner && (
        <EditableField
          label="Phone (Optional)"
          value={profileData.phone}
          fieldName="phone"
          type="tel"
        />
      )}

      {/* Save Button - Only show when editing */}
      {editingField && (
        <div className="pt-2 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading || (isHostelOwner && !validation.fullName.isValid)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Instructions */}
      {!editingField && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600 text-center">
            Click the <FaEdit className="inline text-blue-600" /> icon to edit any field
          </p>
        </div>
      )}
    </form>
  );
};

export default ProfileSettings;