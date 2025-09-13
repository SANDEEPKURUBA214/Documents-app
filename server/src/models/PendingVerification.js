import mongoose from "mongoose";

const pendingSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,   // already hashed
  otp: String,
  otpExpiry: Date,
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
export default mongoose.models.PendingVerification ||
  mongoose.model("PendingVerification", pendingSchema);
