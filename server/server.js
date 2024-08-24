import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import userroutes from "./routes/userroutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import accountSettingsRoutes from "./routes/accountSettingRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import User from "./models/UserModel.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });
const MongoDBStore = connectMongoDBSession(session);
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const router = express.Router();
// Environment variables
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error(
    "MongoDB connection string (MONGO_URL) is not defined in the environment variables."
  );
  process.exit(1);
}

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("MongoDB session store error:", error);
});

// Middleware
app.use(express.json());
app.use(cookieParser(SESSION_SECRET));

app.use(
  cors({
     origin: ["http://localhost:3000",/* "https://iapplyhki.vercel.app"*/],
    credentials: true,
  })
);

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const createToken = (_id, res) => {
  const token = jwt.sign({ _id }, JWT_SECRET, {
    expiresIn: "3d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
};

// Middleware to verify JWT tokens for protected routes
const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Routes
app.use("/api/users", userroutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analytics", analyticRoutes);
app.use("/api/AccountSettings", accountSettingsRoutes);
app.use("/api", employeeRoutes);

app.get("/api/users/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details" });
  }
});

app.use("/api/protected-route", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});
app.use("../netlify/functions/api.js", router);
// Export the express app for serverless deployment
export default app;
