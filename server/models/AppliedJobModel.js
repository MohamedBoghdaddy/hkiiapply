import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["applied", "interview", "offer", "rejected"],
    default: "applied",
  },
  cv: {
    type: String, // Path to the uploaded CV file
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const AppliedJob = mongoose.model("AppliedJob", appliedJobSchema);

export default AppliedJob;
