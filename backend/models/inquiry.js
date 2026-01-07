import mongoose from "mongoose";
const Schema = mongoose.Schema;

const inquirySchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "read", "replied"],
      default: "pending",
    },
    reply: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
inquirySchema.index({ sender: 1, createdAt: -1 });
inquirySchema.index({ receiver: 1, status: 1 });
inquirySchema.index({ car: 1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
