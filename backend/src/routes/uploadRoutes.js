import express from 'express';
import {
  uploadImages,
  deleteImageById,
  deleteMultipleImagesById,
} from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadCarImages } from '../config/cloudinary.js';

const router = express.Router();

// Protected routes - require authentication
router.post('/images', protect, uploadCarImages.array('images', 10), uploadImages);
router.delete('/image/:publicId', protect, deleteImageById);
router.post('/images/delete', protect, deleteMultipleImagesById);

export default router;
