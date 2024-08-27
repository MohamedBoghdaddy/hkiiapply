import express from "express";
import uploadMiddleware from "../Middleware/uploadMiddleware.js";
import {
  getProfile,
  upsertProfile,
  deleteProfile,
  downloadCv,
  deleteCv,
  previewCv,
} from "../controller/profileController.js";

const router = express.Router();

// Use the upload middleware for routes that handle file uploads
router.put("/upsert/:userId", uploadMiddleware, upsertProfile);

// Other routes
router.get("/get/:userId", getProfile);
router.delete("/delete/:userId", deleteProfile);
router.get("/downloadCv/:id", downloadCv);
router.delete("/deleteCv/:id", deleteCv);
router.get("/previewCv/:id", previewCv);

export default router;
