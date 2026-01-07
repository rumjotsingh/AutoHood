import mongoose from "mongoose";
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only favorite a car once
favoriteSchema.index({ user: 1, car: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
