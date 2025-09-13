import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import docRoutes from "./src/routes/docRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();
connectDB();
console.log(process.env.GEMINI_API_KEY);

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "https://documents-app-three.vercel.app",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

// Session with MongoStore
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
