import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Car from '../models/Car.js';
import { paginate, getPaginationParams } from '../utils/pagination.js';
import { deleteImage, deleteMultipleImages } from '../config/cloudinary.js';
import { setCache, getCache, deleteCachePattern } from '../config/redis.js';

// @desc    Get all cars
// @route   GET /api/v1/cars
// @access  Public
export const getAllCars = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const { status = 'active', featured, brand, fuelType, transmission, bodyType, minPrice, maxPrice, city, state } = req.query;

  // Build query
  const query = { status };
  const normalizedFuelType = typeof fuelType === 'string' ? fuelType.toLowerCase() : fuelType;
  const normalizedTransmission = typeof transmission === 'string' ? transmission.toLowerCase() : transmission;
  const normalizedBodyType = typeof bodyType === 'string' ? bodyType.toLowerCase() : bodyType;

  if (featured) query.featured = featured === 'true';
  if (brand) query.brand = brand;
  if (normalizedFuelType) query.fuelType = normalizedFuelType;
  if (normalizedTransmission) query.transmission = normalizedTransmission;
  if (normalizedBodyType) query.bodyType = normalizedBodyType;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }

  // Check cache
  const cacheKey = `cars:${JSON.stringify(query)}:${page}:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      ...cached,
      cached: true,
    });
  }

  const carQuery = Car.find(query)
    .populate('brand', 'name logo')
    .populate('dealer', 'companyName rating location')
    .populate('owner', 'name email')
    .sort('-createdAt');

  const result = await paginate(carQuery, page, limit);

  // Cache result
  await setCache(cacheKey, result, 300); // 5 minutes

  res.json({
    success: true,
    ...result,
  });
});

// @desc    Get all cars for admin
// @route   GET /api/v1/cars/admin/all
// @access  Private (Admin)
export const getAdminCars = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);
  const { status, featured, brand, search } = req.query;

  const query = {};

  if (status) query.status = status;
  if (featured !== undefined) query.featured = featured === 'true';
  if (brand) query.brand = brand;
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { model: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ];
  }

  const carQuery = Car.find(query)
    .populate('brand', 'name logo')
    .populate('dealer', 'companyName rating location')
    .populate('owner', 'name email role')
    .sort('-createdAt');

  const result = await paginate(carQuery, page, limit);

  res.json({
    success: true,
    ...result,
  });
});

// @desc    Get single car
// @route   GET /api/v1/cars/:id
// @access  Public
export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id)
    .populate('brand', 'name logo country')
    .populate('dealer', 'companyName rating location contactEmail contactPhone')
    .populate('owner', 'name email phone')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' },
    });

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found',
    });
  }

  // Increment view count
  car.stats.views += 1;
  await car.save();

  res.json({
    success: true,
    data: car,
  });
});

// @desc    Create new car
// @route   POST /api/v1/cars
// @access  Private (Dealer/Admin)
export const createCar = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.owner = req.user.id;

  // If user is dealer, add dealer reference
  if (req.user.dealerProfile) {
    req.body.dealer = req.user.dealerProfile;
  }

  // Images should already be uploaded and URLs provided in req.body.images
  // No need to handle file uploads here

  const car = await Car.create(req.body);

  // Clear cache
  await deleteCachePattern('cars:*');

  res.status(201).json({
    success: true,
    data: car,
  });
});

// @desc    Update car
// @route   PUT /api/v1/cars/:id
// @access  Private (Owner/Admin)
export const updateCar = asyncHandler(async (req, res) => {
  let car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found',
    });
  }

  // Check ownership
  if (car.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this car',
    });
  }

  // Images should already be uploaded and URLs provided in req.body.images
  // If images are being replaced, frontend should delete old ones via upload API
  // No need to handle file uploads or deletions here

  // Update the car
  car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Clear cache
  await deleteCachePattern('cars:*');

  res.json({
    success: true,
    data: car,
  });
});

// @desc    Delete car
// @route   DELETE /api/v1/cars/:id
// @access  Private (Owner/Admin)
export const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found',
    });
  }

  // Check ownership
  if (car.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this car',
    });
  }

  // Delete images from Cloudinary
  if (car.images && car.images.length > 0) {
    const publicIds = car.images.map(img => img.public_id);
    await deleteMultipleImages(publicIds);
  }

  await car.deleteOne();

  // Clear cache
  await deleteCachePattern('cars:*');

  res.json({
    success: true,
    message: 'Car deleted successfully',
  });
});

// @desc    Search cars
// @route   GET /api/v1/cars/search
// @access  Public
export const searchCars = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const { page: currentPage, limit: itemsPerPage } = getPaginationParams(req);

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const query = Car.find({
    $text: { $search: q },
    status: 'active',
  })
    .populate('brand', 'name logo')
    .populate('dealer', 'companyName rating')
    .sort({ score: { $meta: 'textScore' } });

  const result = await paginate(query, currentPage, itemsPerPage);

  res.json({
    success: true,
    ...result,
  });
});

// @desc    Get featured cars
// @route   GET /api/v1/cars/featured
// @access  Public
export const getFeaturedCars = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  // Check cache
  const cacheKey = `cars:featured:${limit}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      data: cached,
      cached: true,
    });
  }

  const cars = await Car.find({ status: 'active', featured: true })
    .populate('brand', 'name logo')
    .populate('dealer', 'companyName rating')
    .limit(parseInt(limit))
    .sort('-createdAt');

  // Cache result
  await setCache(cacheKey, cars, 600); // 10 minutes

  res.json({
    success: true,
    data: cars,
  });
});

// @desc    Get my listings
// @route   GET /api/v1/cars/my-listings
// @access  Private
export const getMyListings = asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationParams(req);

  const query = Car.find({ owner: req.user.id })
    .populate('brand', 'name logo')
    .sort('-createdAt');

  const result = await paginate(query, page, limit);

  res.json({
    success: true,
    ...result,
  });
});

// @desc    Update car status
// @route   PATCH /api/v1/cars/:id/status
// @access  Private (Owner/Admin)
export const updateCarStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found',
    });
  }

  // Check ownership
  if (car.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  car.status = status;
  if (status === 'sold') {
    car.soldAt = Date.now();
  }
  await car.save();

  // Clear cache
  await deleteCachePattern('cars:*');

  res.json({
    success: true,
    data: car,
  });
});

export default {
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
};
