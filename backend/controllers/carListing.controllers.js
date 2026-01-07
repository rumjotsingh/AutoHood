import CarsModel from "../models/carListing.js";
import fs from "fs";
import path from "path";
export const GetAllCarsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    // Use Promise.all to parallelize total count & data fetch
    const [totalCars, cars] = await Promise.all([
      CarsModel.countDocuments(),
      CarsModel.find({})
        .skip(skip)
        .limit(limit)
        .populate({
          path: "owner",
          select: "name email", // Only needed fields
          options: { lean: true }, // convert populate to plain JS
        })
        .populate({
          path: "reviews",
          select: "rating comment",
          populate: { path: "author", select: "name email" },
          options: { lean: true },
        })
        .lean(), // Remove Mongoose overhead
    ]);

    return res.status(200).json({
      cars,
      pagination: {
        totalCars,
        totalPages: Math.ceil(totalCars / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSingleCarController = async (req, res) => {
  try {
    let { id } = req.params;

    const car = await CarsModel.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author", select: "name email" }, // Populate the author details
      })
      .populate({
        path: "owner",
        select: "-password -__v",
      });
    // Populate the author
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    } else {
      return res.status(200).json(car);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createCarListing = async (req, res) => {
  try {
    const { engine, company, description, color, mileage, price } = req.body;
    const id = req.user.userId;
    const errors = [];

    // **Validation Checks**
    if (!engine || typeof engine !== "string") {
      errors.push("Engine is required and must be a string.");
    }
    if (!company || typeof company !== "string") {
      errors.push("Company is required and must be a string.");
    }
    if (!description || typeof description !== "string") {
      errors.push("Description is required and must be a string.");
    }
    if (!color || typeof color !== "string") {
      errors.push("Color is required and must be a string.");
    }
    if (!mileage || isNaN(mileage) || mileage <= 0) {
      errors.push("Mileage is required and must be a positive number.");
    }
    if (!price || isNaN(price) || price <= 0) {
      errors.push("Price is required and must be a positive number.");
    }

    // ✅ **Fix: Handle Cloudinary Image Upload Properly**
    if (!req.file || !req.file.path) {
      errors.push("Image upload failed or missing.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    const newCar = new CarsModel({
      engine,
      company,
      description,
      color,
      mileage,
      price,
      image: {
        url: req.file.path, // ✅ **Use Cloudinary URL instead of local path**
        filename: req.file.filename, // **Optional**
      },
      owner: id,
    });

    await newCar.save();
    return res
      .status(200)
      .json({ message: "Car listing created successfully", newCar });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const deleteCarController = async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.userId;
    const car = await CarsModel.findById(carId).populate({
      path: "reviews",
      populate: { path: "author", select: "name email" }, // Populate the author details
    });
    if (!car) {
      return res.status(404).json({ message: "Car listing not found" });
    }
    //prper the logic to delete the image from cloudinary
    if (car.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this car listing",
      });
    }
    await CarsModel.findByIdAndDelete(carId);
    return res
      .status(200)
      .json({ message: "Car listing deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const EditCarController = async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.userId;
    const car = await CarsModel.findById(carId);
    if (car.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this car listing",
      });
    }
    const { engine, company, description, color, mileage, price } = req.body;
    const id = req.user.userId;
    let imageUpdate = {};
    if (req.file) {
      const imageUrl = path.join("uploads", req.file.filename);
      const filename = req.file.filename;
      const imagepath = req.file.path;
      if (car.image && fs.existsSync(car.image.path)) {
        fs.unlinkSync(car.image.path);
      }
      imageUpdate = {
        image: {
          url: imageUrl,
          filename: filename,
        },
      };
    }
    const updatedCar = await CarsModel.findByIdAndUpdate(
      carId,
      {
        ...imageUpdate,
        engine: engine,
        company: company,
        description: description,
        color: color,
        mileage: mileage,
        price: price,
        owner: id,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res
      .status(200)
      .json({ message: "Car updated successfully", data: updatedCar });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update car", error: err.message });
  }
};
export const CarSearchController = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }
    const results = await CarsModel.find({
      $or: [
        { company: { $regex: query, $options: "i" } },
        { color: { $regex: query, $options: "i" } },
        { engine: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get all cars listed by the logged-in user
export const getMyListings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cars = await CarsModel.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "reviews",
        select: "rating",
      })
      .lean();

    return res.status(200).json({
      success: true,
      cars,
      count: cars.length,
    });
  } catch (err) {
    console.error("Error fetching user listings:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch your listings", error: err.message });
  }
};
