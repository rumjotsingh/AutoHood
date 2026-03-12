import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Part from '../models/Part.js';
import { getPaginationParams } from '../utils/pagination.js';

// @desc    Get all parts
// @route   GET /api/v1/parts
// @access  Public
export const getAllParts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { category, brand, minPrice, maxPrice, condition } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (condition) query.condition = condition;
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }

  const parts = await Part.find(query)
    .populate('brand', 'name logo')
    .populate('seller', 'name email')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Part.countDocuments(query);

  res.json({
    success: true,
    data: parts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

// @desc    Get part by ID
// @route   GET /api/v1/parts/:id
// @access  Public
export const getPartById = asyncHandler(async (req, res) => {
  const part = await Part.findById(req.params.id)
    .populate('brand', 'name logo')
    .populate('seller', 'name email phone')
    .populate('dealer', 'companyName location');

  if (!part) {
    return res.status(404).json({
      success: false,
      message: 'Part not found',
    });
  }

  part.stats.views += 1;
  await part.save();

  res.json({
    success: true,
    data: part,
  });
});

// @desc    Create part
// @route   POST /api/v1/parts
// @access  Private (Dealer/Admin)
export const createPart = asyncHandler(async (req, res) => {
  req.body.seller = req.user.id;
  if (req.user.dealerProfile) {
    req.body.dealer = req.user.dealerProfile;
  }

  const part = await Part.create(req.body);

  res.status(201).json({
    success: true,
    data: part,
  });
});

// @desc    Update part
// @route   PUT /api/v1/parts/:id
// @access  Private (Owner/Admin)
export const updatePart = asyncHandler(async (req, res) => {
  let part = await Part.findById(req.params.id);

  if (!part) {
    return res.status(404).json({
      success: false,
      message: 'Part not found',
    });
  }

  if (part.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  part = await Part.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: part,
  });
});

// @desc    Delete part
// @route   DELETE /api/v1/parts/:id
// @access  Private (Owner/Admin)
export const deletePart = asyncHandler(async (req, res) => {
  const part = await Part.findById(req.params.id);

  if (!part) {
    return res.status(404).json({
      success: false,
      message: 'Part not found',
    });
  }

  if (part.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  await part.deleteOne();

  res.json({
    success: true,
    message: 'Part deleted successfully',
  });
});

// @desc    Search parts
// @route   GET /api/v1/parts/search
// @access  Public
export const searchParts = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const { page: currentPage, limit: itemsPerPage, skip } = getPaginationParams(req);

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required',
    });
  }

  const parts = await Part.find({
    $text: { $search: q },
    isActive: true,
  })
    .populate('brand', 'name logo')
    .skip(skip)
    .limit(itemsPerPage)
    .sort({ score: { $meta: 'textScore' } });

  const total = await Part.countDocuments({
    $text: { $search: q },
    isActive: true,
  });

  res.json({
    success: true,
    data: parts,
    pagination: {
      currentPage,
      totalPages: Math.ceil(total / itemsPerPage),
      totalItems: total,
      itemsPerPage,
    },
  });
});

export default {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  searchParts,
};
