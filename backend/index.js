import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import carRoutes from "./routes/carListing.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import feedbackesRoutes from "./routes/feedback.routes.js";
import PaymentRoutes from "./routes/Payment.routes.js";

dotenv.config();
const app = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
app.listen(process.env.PORT, (req, res) => {
  console.log("the sever is listening up port ", process.env.PORT);
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/feedbacks", feedbackesRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/stripe", PaymentRoutes);
