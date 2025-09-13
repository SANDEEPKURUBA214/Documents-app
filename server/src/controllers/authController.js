// controllers/authController.js
import User from "../models/user.js";
import PendingVerification from "../models/PendingVerification.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmails.js";
import generateToken from "../utils/generateToken.js";
import Otp from "../models/otpModel.js"
import  jwt  from 'jsonwebtoken';


// 1️⃣ Register → send OTP
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // save OTP in DB (overwrite if exists)
    await Otp.findOneAndUpdate(
      { email },
      { otp, name, password: hashedPassword, role },
      { upsert: true, new: true }
    );

    // send OTP email
    await sendEmail(email, "Verify your account", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Verify OTP → create user + return JWT
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email });
    if (!record) return res.status(400).json({ message: "No OTP found or expired" });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.create({
      name: record.name,
      email,
      password: record.password,
      role: record.role,
      isVerified: true,
    });

    // delete OTP record
    await Otp.deleteOne({ email });

    // create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "Account verified successfully!",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Login → only verified users
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
