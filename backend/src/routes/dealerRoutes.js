import express from 'express';
import {
  registerDealer,
  getDealerProfile,
  updateDealerProfile,
  getAllDealers,
  getDealerById,
  verifyDealer,
  getDealerStats,
} from '../controllers/dealerController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllDealers);
router.get('/:id', getDealerById);

// Protected routes
router.post('/register', protect, registerDealer);
router.get('/profile', protect, authorize('dealer'), getDealerProfile);
router.put('/profile', protect, authorize('dealer'), updateDealerProfile);
router.get('/stats', protect, authorize('dealer'), getDealerStats);
router.patch('/:id/verify', protect, authorize('admin'), verifyDealer);

export default router;
