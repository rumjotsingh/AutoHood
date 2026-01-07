import mongoose from "mongoose";
import dotenv from "dotenv";
import CarListing from "../models/carListing.js";
import initData from "./data.js";
dotenv.config();
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
const initDB = async () => {
  await CarListing.insertMany(initData.data);
  console.log("data was initialized");
};
initDB();
