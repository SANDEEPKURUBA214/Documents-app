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

app.use(cors({
  origin: ["https://documents-app-three.vercel.app","http://localhost:5173","http://localhost:5173"], // allow both dev ports
  credentials: true,  // allow cookies/auth headers
}));


import session from "express-session";

app.use(
  session({
    name: "sid", // session cookie name
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,                     // cannot be accessed by JS
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "none",                    // allows cross-origin cookies
      maxAge: 1000 * 60 * 60 * 24,        // 1 day
    },
  })
);


app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", docRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



