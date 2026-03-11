import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import CarsModel from "../models/carListing.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || 
        process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret_here') {
      console.error("Razorpay credentials not configured properly");
      return res.status(500).json({ 
        message: "Payment gateway not configured. Please contact support." 
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Car ID is required" });
    }

    const car = await CarsModel.findById(id).populate({
      path: "reviews",
      populate: { path: "author", select: "name email" },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const priceInInr = car.price;
    const amountInPaise = Math.round(priceInInr * 100); // Convert to paise

    // Razorpay test mode limit: ₹50,00,000 (5,000,000 paise)
    const MAX_AMOUNT_PAISE = 5000000; // ₹50,000 in test mode
    const DEMO_MODE = process.env.RAZORPAY_DEMO_MODE === 'true';
    
    // If amount exceeds limit and not in demo mode, return error
    if (amountInPaise > MAX_AMOUNT_PAISE && !DEMO_MODE) {
      return res.status(400).json({ 
        message: `Amount ₹${priceInInr.toLocaleString('en-IN')} exceeds Razorpay test mode limit of ₹50,000. Enable DEMO_MODE in .env for testing or use live keys.`,
        maxAmount: MAX_AMOUNT_PAISE / 100,
        currentAmount: priceInInr
      });
    }

    // Demo mode for high-value transactions (testing only)
    if (DEMO_MODE && amountInPaise > MAX_AMOUNT_PAISE) {
      console.log("⚠️ DEMO MODE: Simulating payment for high-value car");
      return res.json({
        orderId: `demo_order_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        demoMode: true,
        carDetails: {
          name: car.company,
          model: car.model || "N/A",
          description: car.description,
          price: priceInInr,
        },
      });
    }

    // Generate a short receipt ID (max 40 characters)
    const shortId = id.substring(id.length - 8); // Last 8 chars of car ID
    const timestamp = Date.now().toString().substring(7); // Last 6 digits of timestamp
    const receipt = `rcpt_${shortId}_${timestamp}`; // Format: rcpt_12345678_123456

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt,
      notes: {
        carId: id,
        carName: car.company,
        carModel: car.model || "N/A",
      },
    };

    console.log("Creating Razorpay order with options:", {
      ...options,
      amountInINR: amountInPaise / 100
    });

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created successfully:", order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      carDetails: {
        name: car.company,
        model: car.model || "N/A",
        description: car.description,
        price: priceInInr,
      },
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ 
      message: err.message || "Failed to create payment order",
      error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
};

// Verify Razorpay payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get payment details
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    res.json(payment);
  } catch (err) {
    console.error("Error fetching payment details:", err);
    res.status(500).json({ message: err.message });
  }
};
