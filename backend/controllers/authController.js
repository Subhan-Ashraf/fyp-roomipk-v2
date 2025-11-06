import { User } from '../models/User.js';
import { VerificationCode } from '../models/VerificationCode.js';
import { generateToken } from '../utils/auth.js';
import { sendVerificationEmail } from '../utils/email.js';

// Generate 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ SEND VERIFICATION CODE
export const sendVerification = async (req, res) => {
  const { email } = req.body;

  console.log('📧 Sending verification to:', email);

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const code = generateVerificationCode();
    console.log('🔐 Generated code:', code);

    // Store verification code in database
    await VerificationCode.create(email, code);
    console.log('💾 Code stored in database');

    // Send email
    const emailSent = await sendVerificationEmail(email, code);

    if (emailSent) {
      console.log('✅ Email sent successfully');
      res.json({ 
        success: true, 
        message: 'Verification code sent to your email' 
      });
    } else {
      console.log('❌ Failed to send email');
      res.status(500).json({ 
        error: 'Failed to send verification email' 
      });
    }
  } catch (error) {
    console.error('❌ Error in send-verification:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + error.message 
    });
  }
};

// ✅ VERIFY AND REGISTER
export const verifyAndRegister = async (req, res) => {
  const { email, code, userData } = req.body;

  console.log('🔍 Verification attempt:', { email, code });

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  try {
    const storedCode = await VerificationCode.findByEmail(email);
    console.log('📦 Stored code from DB:', storedCode);

    if (!storedCode) {
      console.log('❌ No stored code found or it expired for:', email);
      return res.status(400).json({ error: 'No verification code found or code expired' });
    }

    if (storedCode.code !== code) {
      console.log('❌ Code mismatch for:', email);
      await VerificationCode.incrementAttempts(email);
      console.log('⚠️ Incremented attempts for', email, '-> now:', (storedCode.attempts || 0) + 1);

      if (storedCode.attempts >= 5) {
        await VerificationCode.deleteCode(email);
        console.log('🧹 Deleted code due to too many attempts for:', email);
        return res.status(400).json({ error: 'Too many failed attempts. Please request a new code.' });
      }

      return res.status(400).json({ error: 'Invalid verification code' });
    }

    console.log('✅ Code verified successfully for:', email);

    // Code is valid - register user
    const user = await User.create(userData);
    console.log('✅ User created with id:', user._id);

    await User.verifyUser(email);
    console.log('✅ User email marked verified for:', email);

    await VerificationCode.deleteCode(email);
    console.log('🧹 Verification code deleted for:', email);

    // Generate JWT token
    const token = generateToken(user._id);
    console.log('🔑 Token generated for user id:', user._id);

    res.json({ 
      success: true, 
      message: 'Registration successful! Welcome to Roomi.pk!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        isVerified: true
      },
      token
    });

  } catch (error) {
    console.error('❌ Registration error:', error);

    if (error.message && error.message.includes('already exists')) {
      console.log('⚠️ Registration failed: user already exists for email:', email);
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// ✅ LOGIN USER
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findByEmail(username) || await User.findByUsername(username);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(400).json({ error: 'Account is deactivated' });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update login stats
    await User.updateLoginStats(user._id);

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
        profile: user.profile
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ RESEND VERIFICATION CODE
export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const code = generateVerificationCode();

    await VerificationCode.create(email, code);

    const emailSent = await sendVerificationEmail(email, code);

    if (emailSent) {
      res.json({ 
        success: true, 
        message: 'New verification code sent to your email' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send verification email' 
      });
    }
  } catch (error) {
    console.error('Error in resend-verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ VERIFY CURRENT PASSWORD
export const verifyPassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    res.json({
      success: true,
      message: 'Password verified successfully'
    });

  } catch (error) {
    console.error('Password verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};