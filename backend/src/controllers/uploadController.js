import { asyncHandler } from '../middlewares/errorMiddleware.js';
import { deleteImage, deleteMultipleImages } from '../config/cloudinary.js';

// @desc    Upload images to Cloudinary
// @route   POST /api/v1/upload/images
// @access  Private
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded',
    });
  }
  console.log(req.file)

  // Map uploaded files to return URLs and public_ids
  const uploadedImages = req.files.map(file => ({
    url: file.path,
    public_id: file.filename,
  }));

  res.status(200).json({
    success: true,
    message: `${uploadedImages.length} image(s) uploaded successfully`,
    data: uploadedImages,
  });
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/v1/upload/image/:publicId
// @access  Private
export const deleteImageById = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    return res.status(400).json({
      success: false,
      message: 'Public ID is required',
    });
  }

  // Decode the public_id (it might be URL encoded)
  const decodedPublicId = decodeURIComponent(publicId);

  const result = await deleteImage(decodedPublicId);

  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Failed to delete image',
    });
  }

  res.json({
    success: true,
    message: 'Image deleted successfully',
    data: result,
  });
});

// @desc    Delete multiple images from Cloudinary
// @route   POST /api/v1/upload/images/delete
// @access  Private
export const deleteMultipleImagesById = asyncHandler(async (req, res) => {
  const { publicIds } = req.body;

  if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Public IDs array is required',
    });
  }

  const result = await deleteMultipleImages(publicIds);

  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Failed to delete images',
    });
  }

  res.json({
    success: true,
    message: `${publicIds.length} image(s) deleted successfully`,
    data: result,
  });
});

export default {
  uploadImages,
  deleteImageById,
  deleteMultipleImagesById,
};
