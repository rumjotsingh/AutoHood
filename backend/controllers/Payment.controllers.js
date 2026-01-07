import Stripe from "stripe";
import dotenv from "dotenv";
import CarsModel from "../models/carListing.js";
dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const MAX_AMOUNT_IN_CENTS = 99999999;
const EXCHANGE_RATE_INR_TO_USD = 83;
export const getPayment = async (req, res) => {
  try {
    let { id } = req.body;

    const car = await CarsModel.findById(id).populate({
      path: "reviews",
      populate: { path: "author", select: "name email" }, // Populate the author details
    });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    const priceInInr = car.price; // Assuming price
    const priceInUsd = priceInInr / EXCHANGE_RATE_INR_TO_USD;
    const priceInCents = Math.round(priceInUsd * 100);
    if (priceInCents > MAX_AMOUNT_IN_CENTS) {
      return res.status(400).json({
        message: `Price exceeds maximum allowed amount of $999,999.99 USD. Current price: $${priceInUsd.toFixed(
          2
        )}`,
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: car.company,
              description: car.description,
            },
            unit_amount: priceInCents, // Already in paise (e.g., 1000 for 10 INR)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/cars/payment/${id}/success`,
      cancel_url: `http://localhost:5173/cars/payment/${id}/cancel`,
    });

    res.json({
      url: session.url,
      id: session.id,
      priceInUsd: Math.round(priceInUsd),
      priceInInr: priceInInr,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
