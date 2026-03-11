import express from "express";
import { createOrder, verifyPayment, getPaymentDetails } from "../controllers/Payment.controllers.js";
import { authenticate } from "../middleware.js";

const router = express.Router();

// Test route to verify router is working
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Razorpay routes are working!" });
});

router.post("/create-order", authenticate, createOrder);
router.post("/verify-payment", authenticate, verifyPayment);
router.get("/payment-details/:paymentId", authenticate, getPaymentDetails);

export default router;
