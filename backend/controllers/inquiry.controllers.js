import Inquiry from "../models/inquiry.js";
import CarsModel from "../models/carListing.js";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send inquiry to car owner
export const sendInquiry = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { carId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (message.length > 1000) {
      return res
        .status(400)
        .json({ message: "Message is too long (max 1000 characters)" });
    }

    // Get car with owner info
    const car = await CarsModel.findById(carId).populate("owner", "name email");
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (!car.owner) {
      return res
        .status(400)
        .json({ message: "Car owner information not available" });
    }

    // Prevent self-inquiry
    if (car.owner._id.toString() === senderId) {
      return res
        .status(400)
        .json({ message: "You cannot send an inquiry for your own listing" });
    }

    // Get sender info
    const sender = await User.findById(senderId);

    // Create inquiry
    const inquiry = new Inquiry({
      car: carId,
      sender: senderId,
      receiver: car.owner._id,
      message: message.trim(),
    });

    await inquiry.save();

    // Send email notification to car owner (optional - only if SMTP configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"AutoHood" <${process.env.SMTP_USER}>`,
          to: car.owner.email,
          subject: `New Inquiry for Your ${car.company} Listing`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 20px; text-align: center;">
                <h1 style="color: #F97316; margin: 0;">AutoHood</h1>
              </div>
              <div style="padding: 30px; background: #F8FAFC;">
                <h2 style="color: #0F172A;">New Inquiry Received!</h2>
                <p style="color: #64748B;">You have received a new inquiry for your car listing.</p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E2E8F0;">
                  <h3 style="color: #0F172A; margin-top: 0;">${car.company}</h3>
                  <p style="color: #64748B;">Price: ₹${car.price.toLocaleString(
                    "en-IN"
                  )}</p>
                </div>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E2E8F0;">
                  <p style="color: #64748B; margin: 0 0 10px;"><strong>From:</strong> ${
                    sender.name
                  } (${sender.email})</p>
                  <p style="color: #0F172A; margin: 0;"><strong>Message:</strong></p>
                  <p style="color: #64748B; background: #F1F5F9; padding: 15px; border-radius: 8px;">${message}</p>
                </div>
                
                <p style="color: #64748B; font-size: 14px;">Log in to your AutoHood account to reply to this inquiry.</p>
              </div>
              <div style="background: #0F172A; padding: 20px; text-align: center;">
                <p style="color: #94A3B8; margin: 0; font-size: 12px;">© 2026 AutoHood. All rights reserved.</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      inquiry: {
        id: inquiry._id,
        car: car.company,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send inquiry", error: error.message });
  }
};

// Get inquiries sent by user
export const getSentInquiries = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      Inquiry.find({ sender: userId })
        .populate("car", "company price image")
        .populate("receiver", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments({ sender: userId }),
    ]);

    res.status(200).json({
      success: true,
      inquiries,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get inquiries", error: error.message });
  }
};

// Get inquiries received by user (for their listings)
export const getReceivedInquiries = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // Optional filter

    const query = { receiver: userId };
    if (status && ["pending", "read", "replied"].includes(status)) {
      query.status = status;
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .populate("car", "company price image")
        .populate("sender", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      inquiries,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get inquiries", error: error.message });
  }
};

// Reply to an inquiry
export const replyToInquiry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { inquiryId } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const inquiry = await Inquiry.findById(inquiryId)
      .populate("sender", "name email")
      .populate("car", "company");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.receiver.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reply to this inquiry" });
    }

    inquiry.reply = reply.trim();
    inquiry.status = "replied";
    inquiry.repliedAt = new Date();
    await inquiry.save();

    // Send email notification to sender (optional)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter();
        const replier = await User.findById(userId);

        await transporter.sendMail({
          from: `"AutoHood" <${process.env.SMTP_USER}>`,
          to: inquiry.sender.email,
          subject: `Reply to Your Inquiry - ${inquiry.car.company}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 20px; text-align: center;">
                <h1 style="color: #F97316; margin: 0;">AutoHood</h1>
              </div>
              <div style="padding: 30px; background: #F8FAFC;">
                <h2 style="color: #0F172A;">You Got a Reply!</h2>
                <p style="color: #64748B;">The seller has responded to your inquiry.</p>
                
                <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E2E8F0;">
                  <p style="color: #64748B; margin: 0 0 10px;"><strong>From:</strong> ${replier.name}</p>
                  <p style="color: #0F172A; margin: 0;"><strong>Reply:</strong></p>
                  <p style="color: #64748B; background: #F1F5F9; padding: 15px; border-radius: 8px;">${reply}</p>
                </div>
              </div>
              <div style="background: #0F172A; padding: 20px; text-align: center;">
                <p style="color: #94A3B8; margin: 0; font-size: 12px;">© 2026 AutoHood. All rights reserved.</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      inquiry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to reply to inquiry", error: error.message });
  }
};

// Mark inquiry as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { inquiryId } = req.params;

    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (inquiry.status === "pending") {
      inquiry.status = "read";
      await inquiry.save();
    }

    res.status(200).json({
      success: true,
      message: "Inquiry marked as read",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mark as read", error: error.message });
  }
};

// Get unread inquiry count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await Inquiry.countDocuments({
      receiver: userId,
      status: "pending",
    });

    res.status(200).json({
      unreadCount: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get unread count", error: error.message });
  }
};
