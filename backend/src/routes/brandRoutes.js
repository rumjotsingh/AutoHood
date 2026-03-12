import express from 'express';
import {
  getAllBrands,
  getAdminBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBrands);
router.get('/admin/all', protect, authorize('admin'), getAdminBrands);
router.get('/:id', getBrandById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createBrand);
router.put('/:id', protect, authorize('admin'), updateBrand);
router.delete('/:id', protect, authorize('admin'), deleteBrand);

export default router;
