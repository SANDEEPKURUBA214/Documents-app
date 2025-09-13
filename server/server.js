import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js"
import docRoutes from "./src/routes/docRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";


dotenv.config();
connectDB();
console.log(process.env.GEMINI_API_KEY)
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5173"], // allow both dev ports
  credentials: true,  // allow cookies/auth headers
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



