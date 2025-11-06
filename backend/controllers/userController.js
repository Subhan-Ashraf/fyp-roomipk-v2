import { User } from '../models/User.js';
import { VerificationCode } from '../models/VerificationCode.js'; // ✅ ADD THIS
import { sendEmailUpdateVerificationEmail } from '../utils/email.js'; // ✅ ADD THIS IMPORT
import { ObjectId } from 'mongodb';

// ... rest of your code ...

// ✅ GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
        profile: user.profile,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ UPGRADE TO HOSTEL OWNER
export const upgradeToOwner = async (req, res) => {
  try {
    const { fullName, age, gender, phone } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!fullName || !age || !gender || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate age
    if (age < 18 || age > 100) {
      return res.status(400).json({ error: 'Age must be between 18 and 100' });
    }

    // Validate phone (basic validation)
    if (phone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid phone number' });
    }

    // Upgrade user to hostel owner
    await User.upgradeToHostelOwner(userId, { fullName, age, gender, phone });
    
    // Fetch updated user
    const updatedUser = await User.findById(userId);
    
    res.json({
      success: true,
      message: 'Successfully upgraded to hostel owner! 🎉',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        userType: updatedUser.userType,
        profile: updatedUser.profile
      }
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, fullName, age, gender, phone } = req.body;

    console.log('🔍 PROFILE UPDATE REQUEST RECEIVED');
    console.log('User ID:', userId);
    console.log('Request body:', req.body);

    // Get current user to check user type
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('✅ User found:', currentUser.username);

    // Validate required fields for hostel owners only
    if (currentUser.userType === 'hostel_owner') {
      if (!fullName || !age || !gender || !phone) {
        return res.status(400).json({ 
          error: 'All profile fields (including phone) are required for hostel owners' 
        });
      }

      // Validate full name format for hostel owners
      const nameValidation = validateFullName(fullName);
      if (!nameValidation.isValid) {
        return res.status(400).json({ error: nameValidation.message });
      }
    }

    // For simple users, only validate name if provided
    if (fullName && currentUser.userType !== 'hostel_owner') {
      const nameValidation = validateFullName(fullName);
      if (!nameValidation.isValid) {
        return res.status(400).json({ error: nameValidation.message });
      }
    }

    // Check if username is being changed and if it's available
    if (username && username !== currentUser.username) {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Prepare update data
    const updateData = {};
    
    if (username) updateData.username = username.toLowerCase();
    if (fullName) updateData['profile.fullName'] = fullName;
    if (age) updateData['profile.age'] = parseInt(age);
    if (gender) updateData['profile.gender'] = gender;
    
    // Phone is required for hostel owners, optional for simple users
    if (phone !== undefined) {
      updateData['profile.phone'] = phone;
    }
    
    // Always update the updatedAt field
    updateData.updatedAt = new Date();

    console.log('🔄 Updating user with data:', updateData);

    // Perform the update
    const result = await User.collection().updateOne(
      { _id: currentUser._id },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      console.log('⚠️ No changes made to user profile');
      return res.status(400).json({ error: 'No changes detected' });
    }

    console.log('✅ Profile updated successfully');

    // Fetch updated user
    const updatedUser = await User.findById(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        userType: updatedUser.userType,
        isVerified: updatedUser.isVerified,
        profile: updatedUser.profile,
        stats: updatedUser.stats,
        createdAt: updatedUser.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// ✅ NAME VALIDATION FUNCTION
const validateFullName = (name) => {
  if (!name.trim()) {
    return { isValid: false, message: 'Full name is required' };
  }

  // Check if name has at least two parts (first and last name)
  const nameParts = name.trim().split(/\s+/);
  if (nameParts.length < 2) {
    return { isValid: false, message: 'Please enter both first and last name' };
  }

  // Check each part starts with capital letter and has reasonable length
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

  // Check for ridiculous names (repeating characters, etc.)
  if (/(.)\1{3,}/.test(name)) {
    return { isValid: false, message: 'Please enter a valid name' };
  }

  // Check for numbers and special characters
  if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(name)) {
    return { isValid: false, message: 'Name should contain only letters and spaces' };
  }

  return { isValid: true, message: 'Valid name format' };
};

// ✅ UPDATE EMAIL WITH VERIFICATION
export const updateEmail = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newEmail, currentPassword, code } = req.body;

    console.log('📧 EMAIL UPDATE REQUEST RECEIVED');
    console.log('User ID:', userId);
    console.log('New email:', newEmail);

    if (!newEmail || !currentPassword || !code) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Get current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await User.comparePassword(currentPassword, currentUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if new email is already taken
    const existingUser = await User.findByEmail(newEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Verify the verification code
    const verificationCode = await VerificationCode.findByEmail(newEmail);
    if (!verificationCode) {
      return res.status(400).json({ error: 'No verification code found or code expired' });
    }

    if (verificationCode.code !== code) {
      await VerificationCode.incrementAttempts(newEmail);
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update email
    const result = await User.collection().updateOne(
      { _id: currentUser._id },
      { 
        $set: { 
          email: newEmail.toLowerCase(),
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to update email' });
    }

    // Delete used verification code
    await VerificationCode.deleteCode(newEmail);

    console.log('✅ Email updated successfully');

    // Fetch updated user
    const updatedUser = await User.findById(userId);

    res.json({
      success: true,
      message: 'Email updated successfully!',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        userType: updatedUser.userType,
        isVerified: updatedUser.isVerified,
        profile: updatedUser.profile
      }
    });

  } catch (error) {
    console.error('❌ Email update error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// ✅ GENERATE 4-DIGIT CODE FOR EMAIL UPDATE
const generateEmailUpdateCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
};

// ✅ SEND EMAIL UPDATE VERIFICATION CODE
export const sendEmailUpdateCode = async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;
    const userId = req.user.userId;

    console.log('📧 Email update code request for:', newEmail);

    if (!newEmail || !currentPassword) {
      return res.status(400).json({ error: 'New email and current password are required' });
    }

    // Get current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await User.comparePassword(currentPassword, currentUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if new email is already taken
    const existingUser = await User.findByEmail(newEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Generate 4-digit code
    const code = generateEmailUpdateCode();
    console.log('🔐 Generated 4-digit email update code:', code);

    // Store in verification codes collection with a different type
    await VerificationCode.collection().insertOne({
      email: newEmail.toLowerCase(),
      code: code,
      type: 'email_update', // Different from registration
      attempts: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send email (will be logged to console in development)
    const emailSent = await sendEmailUpdateVerificationEmail(newEmail, code);

    if (emailSent) {
      res.json({
        success: true,
        message: 'Verification code sent to your new email',
        code: code // Include code for development
      });
    } else {
      res.json({
        success: true,
        message: 'Verification code: ' + code, // Fallback for development
        code: code
      });
    }

  } catch (error) {
    console.error('❌ Email update code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ VERIFY AND UPDATE EMAIL
export const verifyAndUpdateEmail = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { newEmail, code } = req.body;

    console.log('🔍 Email update verification:', { newEmail, code });

    if (!newEmail || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Find the email update verification code
    const verificationCode = await VerificationCode.collection().findOne({
      email: newEmail.toLowerCase(),
      code: code,
      type: 'email_update',
      expiresAt: { $gt: new Date() }
    });

    if (!verificationCode) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Update user email using User model method
    const result = await User.collection().updateOne(
      { _id: new ObjectId(userId) }, // ✅ NOW ObjectId IS DEFINED
      { 
        $set: { 
          email: newEmail.toLowerCase(),
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to update email' });
    }

    // Delete used verification code
    await VerificationCode.collection().deleteOne({
      email: newEmail.toLowerCase(),
      type: 'email_update'
    });

    console.log('✅ Email updated successfully from user', userId, 'to', newEmail);

    // Fetch updated user
    const updatedUser = await User.findById(userId);

    res.json({
      success: true,
      message: 'Email updated successfully!',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        userType: updatedUser.userType,
        isVerified: updatedUser.isVerified
      }
    });

  } catch (error) {
    console.error('❌ Email update verification error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};