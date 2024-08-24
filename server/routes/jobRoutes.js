import express from "express";
import {
  analyzeCv,
  fetchJobs,
  clusterJobs,
  matchProfile,
  applyJobs,
  saveAppliedJob,
  getUserAnalytics,
  getJobApplicationAnalytics,
  getSubscriptionAnalytics,
  getCountries,
  uploadCV,
  downloadCV,
  softDeleteCV,
  searchJobs,
} from "../controller/AppliedJobController.js"; // Adjust based on your project structure
import { auth } from "../Middleware/authMiddleware.js"; // Assuming you have an auth middleware

const router = express.Router();

// Routes for AI server interactions
router.post("/analyze-cv", analyzeCv);
router.post("/fetch-jobs", fetchJobs);
router.post("/cluster-jobs", clusterJobs);
router.post("/match-profile", matchProfile);
router.post("/apply-jobs", applyJobs);

// Route to save applied jobs
router.post("/save-applied-jobs", saveAppliedJob);

// Analytics routes
router.get("/user-analytics/:userId", getUserAnalytics);
router.get("/job-application-analytics", getJobApplicationAnalytics);
router.get("/subscription-analytics", getSubscriptionAnalytics);

// Route to get available jobs by country
router.get("/countries", getCountries);


// Route to upload CV
router.post("/upload-cv", auth, uploadCV);

// Route to download CV by job ID
router.get("/download-cv/:jobId", auth, downloadCV);

// Route to soft delete a CV by job ID
router.delete("/delete-cv/:jobId", auth, softDeleteCV);

// Route to search jobs
router.get("/search", auth, searchJobs);

export default router;
