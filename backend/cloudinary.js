<<<<<<< HEAD
import multer from "multer";
import mongoose from "mongoose";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import CarsModel from "./models/carListing.js";
// import initdata from "./init/data.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err.message);
  });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECERT,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Carsystem",
    allowedFormat: ["png", "jpeg", "jpg"], // Corrected typo
  },
});

// async function uploadAndInsert() {
//   const updatedListings = [];

//   for (const listing of initdata.data) {
//     try {
//       // Ensure the image URL is present
//       if (!listing.image.url) {
//         console.log("No image URL found for listing:", listing.title);
//         continue;
//       }

//       // Upload image to Cloudinary
//       const result = await cloudinary.uploader.upload(listing.image.url, {
//         folder: "Carsystem", // Optional: set your Cloudinary folder
//       });
//       console.log(`Uploaded image for: ${listing.company}`, result); // Log the full result

//       // Update listing with Cloudinary info
//       const updatedListing = {
//         ...listing,
//         image: {
//           filename: result.public_id,
//           url: result.secure_url,
//         },
//         owner: "67cd91463b436026c3cebb70", // Replace with actual owner id if needed
//       };

//       updatedListings.push(updatedListing);
//     } catch (error) {
//       console.error(`Error uploading image for ${listing.title}:`, error);
//     }
//   }

//   // After all images uploaded, bulk insert into MongoDB
//   try {
//     await CarsModel.insertMany(updatedListings);
//     console.log("All listings inserted into MongoDB!");
//   } catch (dbError) {
//     console.error("Error inserting listings into MongoDB:", dbError);
//   }

//   // Close the MongoDB connection
//   mongoose.connection.close();
// }

// uploadAndInsert();
export const upload = multer({ storage });
=======
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECERT,
});
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Carsystem",
    allowedforamt: ["png", "jpeg", "jpg"],
  },
});
export const upload = multer({ storage });
>>>>>>> 651ad64aded6acf0067968c14ca6558255c72178
