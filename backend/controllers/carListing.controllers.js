import CarsModel from "../models/carListing.js";
import fs from "fs";
import path from "path";
import User from "./../models/user.js";
export const GetAllCarsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const [totalCars, cars] = await Promise.all([
      CarsModel.countDocuments(),
      CarsModel.find({})
        .skip(skip)
        .limit(limit)

        .populate({
          path: "owner",
          select: "name email",
          options: { lean: true },
        })
        .populate({
          path: "reviews",
          select: "rating comment",
          populate: { path: "author", select: "name" },
          options: { lean: true },
        })
        .lean(),
    ]);

    res.status(200).json({
      cars,
      pagination: {
        totalCars,
        totalPages: Math.ceil(totalCars / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getSingleCarController = async (req, res) => {
  try {
    let { id } = req.params;
    const car = await CarsModel.findById(id).populate({
      path: "reviews",

      populate: { path: "author", select: "name email" }, // Populate the author details
    });
    console.log(car);

    const ownerDetails = await User.findById(car.owner).select("name email");
    const carObj = car.toObject();
    carObj.ownerDetails = ownerDetails;
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    } else {
      return res.status(200).json(carObj);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// CREATE Car Listing
export const createCarListing = async (req, res) => {
  try {
    const { engine, company, description, color, mileage, price } = req.body;
    const owner = req.user.userId;

    // Simple Validation
    if (![engine, company, description, color, mileage, price].every(Boolean)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload is required" });
    }

    const newCar = new CarsModel({
      engine,
      company,
      description,
      color,
      mileage: Number(mileage),
      price: Number(price),
      image: { url: req.file.path, filename: req.file.filename },
      owner,
    });

    await newCar.save();
    res.status(201).json({ message: "Car created successfully", newCar });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// DELETE Car Listing
export const deleteCarController = async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.userId;

    const car = await CarsModel.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.owner.toString() !== userId.toString())
      return res
        .status(403)
        .json({ message: "Not authorized to delete this car" });

    // Remove local image file if exists (async)
    if (car.image?.url && car.image?.filename) {
      const imagePath = path.join("uploads", car.image.filename);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        /* Ignore if not found */
      }
    }

    await CarsModel.findByIdAndDelete(carId);
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// EDIT Car Listing
export const EditCarController = async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user.userId;

    const car = await CarsModel.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.owner.toString() !== userId.toString())
      return res
        .status(403)
        .json({ message: "Not authorized to edit this car" });

    const { engine, company, description, color, mileage, price } = req.body;
    const updateData = { engine, company, description, color, mileage, price };

    if (req.file) {
      // Async remove old image
      if (car.image?.filename) {
        const oldPath = path.join("uploads", car.image.filename);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          /* ignore error */
        }
      }
      updateData.image = { url: req.file.path, filename: req.file.filename };
    }

    const updatedCar = await CarsModel.findByIdAndUpdate(carId, updateData, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ message: "Car updated successfully", data: updatedCar });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// SEARCH Car Listing
export const CarSearchController = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query?.trim())
      return res.status(400).json({ message: "Search query is required" });

    const results = await CarsModel.find({
      $or: [
        { company: new RegExp(query, "i") },
        { color: new RegExp(query, "i") },
        { engine: new RegExp(query, "i") },
      ],
    }).lean();

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET My Listings
export const getMyListings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const listings = await CarsModel.find({ owner: userId })
      .populate({
        path: "reviews",
        select: "rating comment",
        options: { lean: true },
      })
      .lean();

    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
