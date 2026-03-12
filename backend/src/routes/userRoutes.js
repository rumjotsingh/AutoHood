import express from 'express';
import {
  getAllUsers,
  getAdminStats,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  updateUserRole,
  updateUserStatus,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/account', protect, deleteUserAccount);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);
router.patch('/:id/status', protect, authorize('admin'), updateUserStatus);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:carId', protect, addToWishlist);
router.delete('/wishlist/:carId', protect, removeFromWishlist);

export default router;
