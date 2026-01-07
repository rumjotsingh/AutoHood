import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //server side validations
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    //genearte some the salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(200).json({
      message: "User created successfully",
      sucess: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    //server side  validations
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    //token generation
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    return res.json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err });
  }
};
export const googleLoginController = async (req, res) => {
  const { googleId, email, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ googleId, email, name });
      await user.save();
    }
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ token, message: "Google login successful" });
  } catch (err) {
    res.status(500).json({ error: "Google login failed", details: err });
  }
};
