import express from 'express';
import {
  getAllCars,
  getAdminCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
  getFeaturedCars,
  getMyListings,
  updateCarStatus,
} from '../controllers/carController.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { uploadCarImages } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllCars);
router.get('/admin/all', protect, authorize('admin'), getAdminCars);
router.get('/search', searchCars);
router.get('/featured', getFeaturedCars);
router.get('/:id', optionalAuth, getCarById);

// Protected routes
router.post('/', protect, authorize('dealer', 'admin'), createCar);
router.get('/my/listings', protect, getMyListings);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);
router.patch('/:id/status', protect, updateCarStatus);

export default router;
