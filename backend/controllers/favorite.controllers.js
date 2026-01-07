import Favorite from "../models/favorite.js";
import CarsModel from "../models/carListing.js";

// Add car to favorites
export const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { carId } = req.params;

    // Check if car exists
    const car = await CarsModel.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      user: userId,
      car: carId,
    });
    if (existingFavorite) {
      return res.status(400).json({ message: "Car already in favorites" });
    }

    const favorite = new Favorite({
      user: userId,
      car: carId,
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: "Car added to favorites",
      favorite,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add to favorites", error: error.message });
  }
};

// Remove car from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { carId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      car: carId,
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({
      success: true,
      message: "Car removed from favorites",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to remove from favorites",
        error: error.message,
      });
  }
};

// Get user's favorites
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      Favorite.find({ user: userId })
        .populate({
          path: "car",
          populate: { path: "owner", select: "name email" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Favorite.countDocuments({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      favorites: favorites.map((f) => f.car),
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
      .json({ message: "Failed to get favorites", error: error.message });
  }
};

// Check if car is in user's favorites
export const checkFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { carId } = req.params;

    const favorite = await Favorite.findOne({ user: userId, car: carId });

    res.status(200).json({
      isFavorite: !!favorite,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to check favorite", error: error.message });
  }
};

// Get favorite count for a car
export const getFavoriteCount = async (req, res) => {
  try {
    const { carId } = req.params;

    const count = await Favorite.countDocuments({ car: carId });

    res.status(200).json({
      carId,
      favoriteCount: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get favorite count", error: error.message });
  }
};
