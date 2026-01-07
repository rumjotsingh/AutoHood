import CarView from "../models/carView.js";
import CarsModel from "../models/carListing.js";
import Favorite from "../models/favorite.js";
import Inquiry from "../models/inquiry.js";
import Review from "../models/review.js";
import User from "../models/user.js";

// Record a car view
export const recordCarView = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user?.userId || null;
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const userAgent = req.headers["user-agent"] || "";

    // Check if car exists
    const car = await CarsModel.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Prevent duplicate views in short time (5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentView = await CarView.findOne({
      car: carId,
      ipAddress,
      viewedAt: { $gte: fiveMinutesAgo },
    });

    if (!recentView) {
      const view = new CarView({
        car: carId,
        user: userId,
        ipAddress,
        userAgent,
      });
      await view.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to record view", error: error.message });
  }
};

// Get car view statistics
export const getCarViewStats = async (req, res) => {
  try {
    const { carId } = req.params;

    const [totalViews, last7Days, last30Days] = await Promise.all([
      CarView.countDocuments({ car: carId }),
      CarView.countDocuments({
        car: carId,
        viewedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      CarView.countDocuments({
        car: carId,
        viewedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    res.status(200).json({
      carId,
      totalViews,
      last7Days,
      last30Days,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get view stats", error: error.message });
  }
};

// Get user dashboard analytics (for car owners)
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's listings
    const userListings = await CarsModel.find({ owner: userId }).select(
      "_id company price"
    );
    const listingIds = userListings.map((l) => l._id);

    // Get various stats
    const [
      totalListings,
      totalViews,
      totalFavorites,
      totalInquiries,
      pendingInquiries,
      totalReviews,
      recentViews,
      popularListings,
    ] = await Promise.all([
      CarsModel.countDocuments({ owner: userId }),
      CarView.countDocuments({ car: { $in: listingIds } }),
      Favorite.countDocuments({ car: { $in: listingIds } }),
      Inquiry.countDocuments({ receiver: userId }),
      Inquiry.countDocuments({ receiver: userId, status: "pending" }),
      Review.countDocuments({ author: userId }),
      CarView.countDocuments({
        car: { $in: listingIds },
        viewedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      // Get most viewed listings
      CarView.aggregate([
        { $match: { car: { $in: listingIds } } },
        { $group: { _id: "$car", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "cars",
            localField: "_id",
            foreignField: "_id",
            as: "car",
          },
        },
        { $unwind: "$car" },
        {
          $project: {
            _id: 1,
            views: 1,
            company: "$car.company",
            price: "$car.price",
            image: "$car.image",
          },
        },
      ]),
    ]);

    // Calculate total potential value of listings
    const totalValue = userListings.reduce((sum, l) => sum + (l.price || 0), 0);

    // Get views trend (last 7 days)
    const viewsTrend = await CarView.aggregate([
      {
        $match: {
          car: { $in: listingIds },
          viewedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        overview: {
          totalListings,
          totalViews,
          totalFavorites,
          totalInquiries,
          pendingInquiries,
          totalReviews,
          totalValue,
          recentViews,
        },
        popularListings,
        viewsTrend,
        listings: userListings,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get dashboard", error: error.message });
  }
};

// Get platform-wide analytics (admin)
export const getPlatformAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCars,
      totalReviews,
      totalInquiries,
      newUsersThisMonth,
      newCarsThisMonth,
      topViewedCars,
      topFavoritedCars,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments(),
      CarsModel.countDocuments(),
      Review.countDocuments(),
      Inquiry.countDocuments(),
      User.countDocuments({
        _id: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .getTime()
            .toString(16)
            .padEnd(24, "0"),
        },
      }),
      CarsModel.countDocuments({
        _id: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .getTime()
            .toString(16)
            .padEnd(24, "0"),
        },
      }),
      // Top 10 viewed cars
      CarView.aggregate([
        { $group: { _id: "$car", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "cars",
            localField: "_id",
            foreignField: "_id",
            as: "car",
          },
        },
        { $unwind: "$car" },
        {
          $project: {
            views: 1,
            company: "$car.company",
            price: "$car.price",
          },
        },
      ]),
      // Top 10 favorited cars
      Favorite.aggregate([
        { $group: { _id: "$car", favorites: { $sum: 1 } } },
        { $sort: { favorites: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "cars",
            localField: "_id",
            foreignField: "_id",
            as: "car",
          },
        },
        { $unwind: "$car" },
        {
          $project: {
            favorites: 1,
            company: "$car.company",
            price: "$car.price",
          },
        },
      ]),
      // Recent activity (last 10 cars)
      CarsModel.find()
        .sort({ _id: -1 })
        .limit(10)
        .select("company price createdAt")
        .lean(),
    ]);

    // Price range distribution
    const priceDistribution = await CarsModel.aggregate([
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            0, 500000, 1000000, 2500000, 5000000, 10000000, 50000000, 100000000,
          ],
          default: "100000000+",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalCars,
          totalReviews,
          totalInquiries,
          newUsersThisMonth,
          newCarsThisMonth,
        },
        topViewedCars,
        topFavoritedCars,
        priceDistribution,
        recentActivity,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get analytics", error: error.message });
  }
};

// Get user's activity summary
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      user,
      listingsCount,
      reviewsCount,
      favoritesCount,
      inquiriesSent,
      inquiriesReceived,
      recentListings,
      recentFavorites,
    ] = await Promise.all([
      User.findById(userId).select("name email createdAt"),
      CarsModel.countDocuments({ owner: userId }),
      Review.countDocuments({ author: userId }),
      Favorite.countDocuments({ user: userId }),
      Inquiry.countDocuments({ sender: userId }),
      Inquiry.countDocuments({ receiver: userId }),
      CarsModel.find({ owner: userId })
        .sort({ _id: -1 })
        .limit(5)
        .select("company price image")
        .lean(),
      Favorite.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("car", "company price image")
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        memberSince: user.createdAt,
      },
      activity: {
        listingsCount,
        reviewsCount,
        favoritesCount,
        inquiriesSent,
        inquiriesReceived,
      },
      recentListings,
      recentFavorites: recentFavorites.map((f) => f.car),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get activity", error: error.message });
  }
};
