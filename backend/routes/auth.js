import express from 'express';
import { 
  sendVerification, 
  verifyAndRegister, 
  login, 
  resendVerification,
  verifyPassword
} from '../controllers/authController.js';
import { authMiddleware } from '../utils/auth.js'; // ✅ ADD THIS FOR verifyPassword

const router = express.Router();

router.post('/send-verification', sendVerification);
router.post('/verify-and-register', verifyAndRegister);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.post('/verify-password', authMiddleware, verifyPassword); // ✅ ADD authMiddleware

export default router;