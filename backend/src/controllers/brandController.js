import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Brand from '../models/Brand.js';
import { getPaginationParams } from '../utils/pagination.js';
import { setCache, getCache, deleteCachePattern } from '../config/redis.js';

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
export const getAllBrands = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { isActive = true, isFeatured } = req.query;

  // Check cache
  const cacheKey = `brands:all:${page}:${limit}:${isActive}:${isFeatured}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      ...cached,
      cached: true,
    });
  }

  const query = { isActive };
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

  const brands = await Brand.find(query)
    .skip(skip)
    .limit(limit)
    .sort('-stats.totalCars');

  const total = await Brand.countDocuments(query);

  const result = {
    data: brands,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };

  // Cache result
  await setCache(cacheKey, result, 3600); // 1 hour

  res.json({
    success: true,
    ...result,
  });
});

// @desc    Get all brands for admin
// @route   GET /api/v1/brands/admin/all
// @access  Private (Admin)
export const getAdminBrands = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { isActive, isFeatured, search } = req.query;

  const query = {};
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { country: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ];
  }

  const brands = await Brand.find(query)
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Brand.countDocuments(query);

  res.json({
    success: true,
    data: brands,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

// @desc    Get brand by ID
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found',
    });
  }

  res.json({
    success: true,
    data: brand,
  });
});

// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private (Admin)
export const createBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.create(req.body);

  // Clear cache
  await deleteCachePattern('brands:*');

  res.status(201).json({
    success: true,
    data: brand,
  });
});

// @desc    Update brand
// @route   PUT /api/v1/brands/:id
// @access  Private (Admin)
export const updateBrand = asyncHandler(async (req, res) => {
  let brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found',
    });
  }

  brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Clear cache
  await deleteCachePattern('brands:*');

  res.json({
    success: true,
    data: brand,
  });
});

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private (Admin)
export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found',
    });
  }

  await brand.deleteOne();

  // Clear cache
  await deleteCachePattern('brands:*');

  res.json({
    success: true,
    message: 'Brand deleted successfully',
  });
});

// @desc    Get popular brands
// @route   GET /api/v1/brands/popular
// @access  Public
export const getPopularBrands = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  // Check cache
  const cacheKey = `brands:popular:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      data: cached,
      cached: true,
    });
  }

  const brands = await Brand.find({ isActive: true })
    .sort('-stats.totalCars')
    .limit(parseInt(limit));

  // Cache result
  await setCache(cacheKey, brands, 3600); // 1 hour

  res.json({
    success: true,
    data: brands,
  });
});

export default {
  getAllBrands,
  getAdminBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getPopularBrands,
};
