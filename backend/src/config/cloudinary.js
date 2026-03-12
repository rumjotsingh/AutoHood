import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Lazy initialization flag
let isConfigured = false;

// Configure Cloudinary function
const configureCloudinary = () => {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME || "di1qyl7k6",
      api_key: process.env.CLOUD_API_KEY || 273916913369734,
      api_secret: process.env.CLOUD_API_SECRET || "Q44r-uz5J1EPVCszXFuq4dzjcb4",
    });
    
    // Verify configuration
    if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
      console.error('⚠️  Cloudinary credentials are missing in environment variables');
      console.log('CLOUD_NAME:', process.env.CLOUD_NAME ? '✓' : '✗');
      console.log('CLOUD_API_KEY:', process.env.CLOUD_API_KEY ? '✓' : '✗');
      console.log('CLOUD_API_SECRET:', process.env.CLOUD_API_SECRET ? '✓' : '✗');
    } else {
      console.log('✓ Cloudinary configured successfully');
      isConfigured = true;
    }
  }
  return cloudinary;
};

// Initialize on import
configureCloudinary();

// Storage for car images
const carStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'autohood/cars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

// Storage for part images
const partStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'autohood/parts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
  },
});

// Storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'autohood/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

// Storage for dealer documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'autohood/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

// Multer upload instances
export const uploadCarImages = multer({
  storage: carStorage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 }, // 10MB
});

export const uploadPartImages = multer({
  storage: partStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      console.log('No public_id provided, skipping delete');
      return null;
    }
    configureCloudinary();
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
    // Don't throw error, just log it
    return null;
  }
};

// Delete multiple images
export const deleteMultipleImages = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) {
      console.log('No public_ids provided, skipping delete');
      return null;
    }
    configureCloudinary();
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting multiple images:', error.message);
    // Don't throw error, just log it
    return null;
  }
};

export default cloudinary;
