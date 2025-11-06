import express from 'express';
import { User } from '../models/User.js';
import { Hostel } from '../models/Hostel.js'; // ensure this model exists
import { authMiddleware } from '../utils/auth.js';

const router = express.Router();

// Create a new hostel (hostel owner only, with owner limit check)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if user can add more hostels
    const canAdd = await User.canAddHostel(userId);

    if (!canAdd) {
      return res.status(400).json({
        error: 'You have reached the maximum limit of 2 hostels per owner'
      });
    }

    // Create hostel (Hostel.create should accept (data, ownerId) or adjust accordingly)
    const hostel = await Hostel.create(req.body, userId);

    // Add hostel to owner's list
    await User.addHostelToOwner(userId, hostel._id || hostel.id);

    res.json({ success: true, hostel });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
