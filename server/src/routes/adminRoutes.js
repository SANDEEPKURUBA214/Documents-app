
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import Doc from "../models/Document.js";

const router = express.Router();
 // List all NON-ADMIN users
// List all NON-ADMIN users
  router.get("/users", protect, adminOnly, async (req, res) => {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("name email"); // explicitly include name, email, role
    res.json(users);
  });

 // Delete a NON-ADMIN user
  router.delete("/users/:id", protect, adminOnly, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (user.role === "admin") {
        return res.status(400).json({ message: "Cannot delete admin" });
      }

      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
  }
  });
 // All docs (for Admin Panel listing)
  router.get("/docs", protect, adminOnly, async (req, res) => {
    const docs = await Doc.find().populate("createdBy", "name email");
    res.json(docs);
  });
  
 export default router