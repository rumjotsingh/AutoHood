import CarsModel from "../models/carListing.js";

// Advanced search with filters
export const advancedSearch = async (req, res) => {
  try {
    const {
      query,
      minPrice,
      maxPrice,
      colors,
      engines,
      minMileage,
      maxMileage,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    // Text search (company, description)
    if (query && query.trim() !== "") {
      filter.$or = [
        { company: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { engine: { $regex: query, $options: "i" } },
        { color: { $regex: query, $options: "i" } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Color filter (multiple values)
    if (colors) {
      const colorArray = colors.split(",").map((c) => c.trim());
      filter.color = { $in: colorArray.map((c) => new RegExp(c, "i")) };
    }

    // Engine filter (multiple values)
    if (engines) {
      const engineArray = engines.split(",").map((e) => e.trim());
      filter.engine = { $in: engineArray.map((e) => new RegExp(e, "i")) };
    }

    // Mileage range
    if (minMileage || maxMileage) {
      filter.mileage = {};
      if (minMileage) filter.mileage.$gte = parseInt(minMileage);
      if (maxMileage) filter.mileage.$lte = parseInt(maxMileage);
    }

    // Sorting
    const sortOptions = {};
    const validSortFields = ["price", "mileage", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [cars, total] = await Promise.all([
      CarsModel.find(filter)
        .populate("owner", "name email")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CarsModel.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      cars,
      pagination: {
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
      },
      filters: {
        query,
        minPrice,
        maxPrice,
        colors,
        engines,
        minMileage,
        maxMileage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// Get filter options (for frontend dropdowns)
export const getFilterOptions = async (req, res) => {
  try {
    const [colors, engines, priceRange, mileageRange] = await Promise.all([
      CarsModel.distinct("color"),
      CarsModel.distinct("engine"),
      CarsModel.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
      CarsModel.aggregate([
        {
          $group: {
            _id: null,
            minMileage: { $min: "$mileage" },
            maxMileage: { $max: "$mileage" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      filters: {
        colors: colors.filter(Boolean).sort(),
        engines: engines.filter(Boolean).sort(),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000000 },
        mileageRange: mileageRange[0] || { minMileage: 0, maxMileage: 50 },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get filter options", error: error.message });
  }
};

// Compare multiple cars
export const compareCars = async (req, res) => {
  try {
    const { carIds } = req.query;

    if (!carIds) {
      return res
        .status(400)
        .json({ message: "carIds query parameter is required" });
    }

    const ids = carIds.split(",").slice(0, 4); // Limit to 4 cars

    if (ids.length < 2) {
      return res
        .status(400)
        .json({ message: "At least 2 car IDs are required for comparison" });
    }

    const cars = await CarsModel.find({ _id: { $in: ids } })
      .populate("owner", "name email")
      .populate({
        path: "reviews",
        select: "rating comment",
        populate: { path: "author", select: "name" },
      })
      .lean();

    if (cars.length < 2) {
      return res
        .status(404)
        .json({ message: "Not enough cars found for comparison" });
    }

    // Calculate average rating for each car
    const carsWithStats = cars.map((car) => {
      const ratings = car.reviews?.map((r) => r.rating) || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      const reviewCount = ratings.length;

      return {
        _id: car._id,
        company: car.company,
        description: car.description,
        engine: car.engine,
        color: car.color,
        mileage: car.mileage,
        price: car.price,
        image: car.image,
        owner: car.owner,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount,
      };
    });

    // Generate comparison insights
    const insights = {
      cheapest: carsWithStats.reduce((a, b) => (a.price < b.price ? a : b))._id,
      mostExpensive: carsWithStats.reduce((a, b) => (a.price > b.price ? a : b))
        ._id,
      bestMileage: carsWithStats.reduce((a, b) =>
        a.mileage > b.mileage ? a : b
      )._id,
      highestRated:
        carsWithStats
          .filter((c) => c.reviewCount > 0)
          .sort((a, b) => b.avgRating - a.avgRating)[0]?._id || null,
      priceDifference:
        Math.max(...carsWithStats.map((c) => c.price)) -
        Math.min(...carsWithStats.map((c) => c.price)),
    };

    res.status(200).json({
      success: true,
      cars: carsWithStats,
      insights,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Comparison failed", error: error.message });
  }
};

// Get similar cars (recommendations)
export const getSimilarCars = async (req, res) => {
  try {
    const { carId } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    const car = await CarsModel.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Find similar cars based on price range, color, and engine
    const priceRange = car.price * 0.3; // 30% range

    const similarCars = await CarsModel.find({
      _id: { $ne: carId },
      $or: [
        {
          price: { $gte: car.price - priceRange, $lte: car.price + priceRange },
        },
        { color: { $regex: car.color, $options: "i" } },
        { engine: { $regex: car.engine, $options: "i" } },
      ],
    })
      .limit(limit)
      .populate("owner", "name")
      .lean();

    res.status(200).json({
      success: true,
      similarCars,
      basedOn: {
        price: car.price,
        color: car.color,
        engine: car.engine,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get similar cars", error: error.message });
  }
};

// Get trending cars (most viewed/favorited recently)
export const getTrendingCars = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    // Import models dynamically to avoid circular dependencies
    const CarView = (await import("../models/carView.js")).default;
    const Favorite = (await import("../models/favorite.js")).default;

    // Get cars with most views in last 7 days
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const trendingByViews = await CarView.aggregate([
      { $match: { viewedAt: { $gte: last7Days } } },
      { $group: { _id: "$car", viewCount: { $sum: 1 } } },
      { $sort: { viewCount: -1 } },
      { $limit: limit },
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
          _id: "$car._id",
          company: "$car.company",
          price: "$car.price",
          image: "$car.image",
          color: "$car.color",
          engine: "$car.engine",
          mileage: "$car.mileage",
          viewCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      trendingCars: trendingByViews,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get trending cars", error: error.message });
  }
};
