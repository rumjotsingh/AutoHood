import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Contact from '../models/Contact.js';
import Car from '../models/Car.js';
import User from '../models/User.js';

// @desc    Send contact message to dealer
// @route   POST /api/v1/contact/dealer
// @access  Private
export const contactDealer = asyncHandler(async (req, res) => {
  const { carId, dealerId, customerName, customerEmail, customerPhone, message, carTitle } = req.body;

  // Validate car exists
  if (carId) {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }
  }

  // Validate dealer exists
  const dealer = await User.findById(dealerId);
  if (!dealer) {
    return res.status(404).json({
      success: false,
      message: 'Dealer not found',
    });
  }

  // Create contact inquiry
  const contact = await Contact.create({
    user: req.user.id,
    dealer: dealerId,
    car: carId,
    customerName,
    customerEmail,
    customerPhone,
    message,
    carTitle,
  });

  // TODO: Send email notification to dealer
  // await sendDealerContactEmail(dealer.email, contact);

  res.status(201).json({
    success: true,
    message: 'Your message has been sent to the dealer. They will contact you soon.',
    data: contact,
  });
});

// @desc    Get dealer inquiries
// @route   GET /api/v1/contact/dealer/inquiries
// @access  Private (Dealer)
export const getDealerInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Contact.find({ dealer: req.user.id })
    .populate('user', 'name email phone')
    .populate('car', 'title price images')
    .sort('-createdAt');

  res.json({
    success: true,
    data: inquiries,
  });
});

// @desc    Get user inquiries
// @route   GET /api/v1/contact/my-inquiries
// @access  Private
export const getMyInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Contact.find({ user: req.user.id })
    .populate('dealer', 'name email phone')
    .populate('car', 'title price images')
    .sort('-createdAt');

  res.json({
    success: true,
    data: inquiries,
  });
});

// @desc    Update inquiry status
// @route   PATCH /api/v1/contact/:id/status
// @access  Private (Dealer)
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status, dealerResponse } = req.body;

  const inquiry = await Contact.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found',
    });
  }

  // Check if user is the dealer
  if (inquiry.dealer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  inquiry.status = status;
  if (dealerResponse) {
    inquiry.dealerResponse = dealerResponse;
    inquiry.respondedAt = Date.now();
  }

  await inquiry.save();

  res.json({
    success: true,
    data: inquiry,
  });
});

export default {
  contactDealer,
  getDealerInquiries,
  getMyInquiries,
  updateInquiryStatus,
};
