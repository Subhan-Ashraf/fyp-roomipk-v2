import express from 'express';
import { 
  getProfile, 
  upgradeToOwner, 
  updateProfile, 
  sendEmailUpdateCode,    // ✅ ADD
  verifyAndUpdateEmail    // ✅ ADD
} from '../controllers/userController.js';
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/upgrade-to-owner', authMiddleware, upgradeToOwner);
router.put('/profile', authMiddleware, updateProfile);
router.post('/email/request-update', authMiddleware, sendEmailUpdateCode);    // ✅ NEW
router.post('/email/verify-update', authMiddleware, verifyAndUpdateEmail);    // ✅ NEW

export default router;