// routes/analyticsRoutes.js
import express from "express";
import {
  getJobApplicationAnalytics,
  getSubscriptionAnalytics,
  getUserAnalytics,
} from "../controller/analyticsController.js";
import { auth, authorizeRoles } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/job-application-analytics", getJobApplicationAnalytics); // Route to fetch job application analytics
router.get("/subscription-analytics",  getSubscriptionAnalytics); // Route to fetch subscription analytics
router.get(
  "/user/:userId",
  auth,
  authorizeRoles("admin", "user"),
  getUserAnalytics
);

export default router;
