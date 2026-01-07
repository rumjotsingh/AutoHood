import mongoose from "mongoose";
const Schema = mongoose.Schema;

const carViewSchema = new Schema(
  {
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
carViewSchema.index({ car: 1, viewedAt: -1 });
carViewSchema.index({ user: 1, car: 1 });

const CarView = mongoose.model("CarView", carViewSchema);
export default CarView;
