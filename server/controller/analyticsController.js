import User from "../models/UserModel.js";
import  AppliedJob  from "../models/AppliedJobModel.js";
import  Subscription from "../models/Subscription.js";

// Analytics for user data
export const getUserAnalytics = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalApplications = await AppliedJob.countDocuments({
      userId: userId,
    });
    const applicationsByStatus = await AppliedJob.aggregate([
      { $match: { userId: userId } },
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

// Analytics for job applications
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

// Analytics for subscriptions
export const getSubscriptionAnalytics = async (req, res) => {
  try {
    const authToken = req.headers.authorization;

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
