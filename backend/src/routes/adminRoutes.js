import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCarsAdmin,
  toggleCarFeatured,
  getAllDealersAdmin,
  verifyDealer,
  getAllOrdersAdmin,
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, authorize('admin'));

// Stats
router.get('/stats', getAdminStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Cars management
router.get('/cars', getAllCarsAdmin);
router.put('/cars/:id/featured', toggleCarFeatured);

// Dealers management
router.get('/dealers', getAllDealersAdmin);
router.put('/dealers/:id/verify', verifyDealer);

// Orders management
router.get('/orders', getAllOrdersAdmin);

export default router;
