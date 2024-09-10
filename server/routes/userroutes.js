import express from "express";
import multer from "multer";
import {
  register,
  login,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  checkAuth,
  uploadCv,
  downloadCv,
  deleteCv,
} from "../controller/usercontroller.js";
import { auth, authorizeRoles } from "../Middleware/authMiddleware.js";

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Configure the storage as needed
const upload = multer({ storage });

const router = express.Router();

// Authentication routes
router.post("/signup", register);
router.post("/login", login);
router.post("/logout", auth, logoutUser);

// User routes with authentication
router.get("/api/users/getone/:userId", auth, getUser);
router.put(
  "/update/:userId",
  auth,
  upload.fields([
    { name: "cvFile", maxCount: 1 },
    { name: "photoFile", maxCount: 1 },
  ]),
  updateUser
);
router.delete("/:userId", auth, deleteUser);

// CV routes
router.post("/uploadCv/:userId", auth, upload.single("cvFile"), uploadCv);
router.get("/downloadCv/:userId", auth, downloadCv);
router.delete("/deleteCv/:userId", auth, deleteCv);

// Admin route
router.get("/admin", auth, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

// Route accessible to both admins and users
router.get("/dashboard", auth, authorizeRoles("admin", "user"), (req, res) => {
  res.status(200).json({ message: "Welcome to the Dashboard" });
});

// Check authentication status
router.get("/checkAuth", auth, checkAuth);

export default router;
