import axios from "axios";
import User from "../models/UserModel.js";
import AppliedJob from "../models/AppliedJobModel.js";
import Subscription from "../models/Subscription.js"; // Assuming you have this model
import Job from "../models/AppliedJobModel.js"; // Assuming Job is defined in AppliedJobModel.js
import path from "path";
import fs from "fs";
// Controller function to get user analytics
export const getUserAnalytics = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalApplications = await AppliedJob.countDocuments({ user: userId });
    const applicationsByStatus = await AppliedJob.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const analytics = {
      totalApplications,
      applicationsByStatus,
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get job application analytics
export const getJobApplicationAnalytics = async (req, res) => {
  try {
    const userId = req.query.userId;

    const analyticsData = await AppliedJob.aggregate([
      { $match: { status: "completed", userId: userId } },
      { $group: { _id: "$userId", totalApplications: { $sum: 1 } } },
      { $sort: { totalApplications: -1 } },
    ]);

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Failed to fetch job application analytics:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch job application analytics", error });
  }
};

// Controller function to get subscription analytics
export const getSubscriptionAnalytics = async (req, res) => {
  try {
    const analyticsData = await Subscription.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", totalSubscriptions: { $sum: 1 } } },
      { $sort: { totalSubscriptions: -1 } },
    ]);

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Failed to fetch subscription analytics:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch subscription analytics", error });
  }
};

// Forward request to AI server to analyze CV
export const analyzeCv = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/analyze-cv",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with AI server:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forward request to AI server to fetch jobs
export const fetchJobs = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/fetch-jobs",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with AI server:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forward request to AI server to cluster jobs
export const clusterJobs = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/cluster-jobs",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with AI server:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forward request to AI server to match profile to job
export const matchProfile = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/match-profile",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with AI server:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Forward request to AI server to apply to jobs
export const applyJobs = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/apply-jobs",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with AI server:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Save applied jobs to database
export const saveAppliedJob = async (req, res) => {
  const { userId, jobDetails } = req.body;

  try {
    const appliedJob = new AppliedJob({
      userId,
      companyName: jobDetails.companyName,
      jobTitle: jobDetails.jobTitle,
      location: jobDetails.location,
      jobDescription: jobDetails.jobDescription,
    });

    const savedJob = await appliedJob.save();
    res
      .status(200)
      .json({ message: "Job application successful", appliedJob: savedJob });
  } catch (error) {
    console.error("Error applying to jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get job counts by country
export const getCountries = async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $group: {
          _id: "$country", // Group by the country field
          count: { $sum: 1 },
        },
      },
    ]);

    const jobCountsByCountry = {};
    jobs.forEach((job) => {
      jobCountsByCountry[job._id] = job.count;
    });

    res.json(jobCountsByCountry);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job data" });
  }
};

// Upload CV
export const uploadCV = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    // Assuming multer is configured to handle file uploads
    const cvPath = req.file.path;

    // Update job application with CV path
    const jobApplication = await AppliedJob.findOneAndUpdate(
      { userId, jobId },
      { cv: cvPath },
      { new: true }
    );

    if (!jobApplication) {
      return res.status(404).json({ message: "Job application not found" });
    }

    res
      .status(200)
      .json({ message: "CV uploaded successfully", jobApplication });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload CV", error });
  }
};

// Download CV by job ID
export const downloadCV = async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobApplication = await AppliedJob.findOne({ jobId });

    if (!jobApplication || jobApplication.deleted) {
      return res.status(404).json({ message: "CV not found" });
    }

    const cvPath = jobApplication.cv;

    if (!cvPath) {
      return res.status(404).json({ message: "CV not uploaded for this job" });
    }

    res.download(cvPath);
  } catch (error) {
    res.status(500).json({ message: "Failed to download CV", error });
  }
};

// Soft delete CV by job ID
export const softDeleteCV = async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobApplication = await AppliedJob.findOneAndUpdate(
      { jobId },
      { deleted: true },
      { new: true }
    );

    if (!jobApplication) {
      return res.status(404).json({ message: "Job application not found" });
    }

    res
      .status(200)
      .json({ message: "CV deleted successfully", jobApplication });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete CV", error });
  }
};

// Search jobs by job title, location, or salary
export const searchJobs = async (req, res) => {
  const { jobTitle, location, salary } = req.query;

  const query = {
    deleted: false,
  };

  if (jobTitle) {
    query.jobTitle = { $regex: jobTitle, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (salary) {
    query.salary = { $gte: Number(salary) };
  }

  try {
    const jobs = await AppliedJob.find(query);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to search jobs", error });
  }
};
