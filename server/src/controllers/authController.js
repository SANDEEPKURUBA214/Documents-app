// controllers/authController.js
import User from "../models/user.js";
import PendingVerification from "../models/PendingVerification.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmails.js";
import generateToken from "../utils/generateToken.js";
import Otp from "../models/otpModel.js"



export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // save OTP in DB (overwrite if exists for same email)
    await Otp.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true }
    );

    // temporarily save user data in req (alternative: store in a staging table)
    req.app.locals.tempUser = {
      [email]: { name, email, password: hashedPassword, role },
    };

    // send OTP email
    await sendEmail(email, "Verify your account", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // check OTP in DB
    const record = await Otp.findOne({ email });
    if (!record) {
      return res.status(400).json({ message: "No OTP found or expired. Please register again." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP matches → create user
    const tempUser = req.app.locals.tempUser?.[email];
    if (!tempUser) {
      return res.status(400).json({ message: "User data missing. Please register again." });
    }

    const { name, password, role } = tempUser;
    const user = await User.create({ name, email, password, role, isVerified: true });

    // cleanup
    await Otp.deleteOne({ email });
    delete req.app.locals.tempUser[email];

    res.status(201).json({ message: "Account verified successfully! Please login.", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Login


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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





  export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    // Example: search by name or email
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};
