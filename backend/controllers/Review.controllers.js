import Review from "../models/review.js";
import CarsModel from "../models/carListing.js";
export const AddReviewsController = async (req, res) => {
  try {
    const { comment, rating, carListingId } = req.body;
    //trye an derror we will able to detect this code

    const id = req.user.userId;

    const carListing = await CarsModel.findById(carListingId);
    if (!carListing) {
      return res.status(404).json({ message: "Car listing not found." });
    }
    //server side validatiions

    if (!comment || !rating) {
      return res.status(500).json({ message: "All Fiedls Are Required" });
    }
    const newReview = new Review({
      comment,
      rating,
      createdAt: new Date(),
      author: id,
      car: carListingId,
    });

    const savedReview = await newReview.save();

    carListing.reviews.push(savedReview._id);
    await carListing.save();
    return res
      .status(200)
      .json({ sucess: true, savedReview, message: "Review SucessFully Added" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { carId } = req.body;
    const userId = req.user.userId;

    // Find and delete the review

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    // Check if the review belongs to the car
    const car = await CarsModel.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car listing not found" });
    }

    // Remove the review ID from the car's reviews array
    car.reviews = car.reviews.filter((id) => id.toString() !== reviewId);
    await car.save();

    // Delete the review
    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getCarDetails = async (req, res) => {
  try {
    const { carId } = req.params;

    // Find the car by ID and populate its reviews and their authors
    const car = await CarsModel.findById(carId).populate({
      path: "reviews",
      populate: { path: "author", select: "name email" }, // Populate the author details
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("Error retrieving car details:", error);
    res.status(500).json({ message: "Failed to retrieve car details." });
  }
};
