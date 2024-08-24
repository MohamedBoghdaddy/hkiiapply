import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({ storage: storage });

// Function to create a JWT token
const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

// User registration
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    const token = createToken(user);

    res.status(201).json({ token, user: { username, email, role } });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      token,
      user: { username: user.username, email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// Middleware for protecting routes
export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware for role-based access
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

// User logout
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

// Get user data
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user data including CV and Photo
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = { ...req.body };

    if (req.files) {
      if (req.files.cvFile) {
        updates.cvFileName = req.files.cvFile[0].filename;
      }
      if (req.files.photoFile) {
        updates.photoUrl = `/uploads/${req.files.photoFile[0].filename}`;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ msg: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error); 
    res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check authentication status
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
