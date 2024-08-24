import express from "express";
import mongoose from "mongoose";
import AccountSettings from "../models/AccountSettingsModel.js";
import { auth, authorizeRoles } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Require auth for all dashboard routes
router.use(auth);

// Get account settings by userId
router.get("/:userId", async (req, res) => {
  try {
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const settings = await AccountSettings.findOne({
      userId: req.params.userId,
    });

    if (!settings)
      return res.status(404).json({ message: "Settings not found" });

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update account settings by userId
router.put("/:userId", async (req, res) => {
  try {
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let settings = await AccountSettings.findOne({ userId: req.params.userId });

    if (!settings) {
      settings = new AccountSettings({
        userId: req.params.userId,
        ...req.body,
      });
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
