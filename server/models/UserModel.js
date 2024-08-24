import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Add roles here
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    receiveNotifications: { type: Boolean, default: true },
    profilePhoto: { type: String },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    currentNationality: { type: String },
    otherNationality: { type: String },
    currentVisaStatus: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    disability: { type: String },
    primaryEmailAddress: { type: String },
    secondaryEmailAddress: { type: String },
    primaryPhoneNumber: { type: String },
    alternatePhoneNumber: { type: String },
    currentAddress: { type: String },
    country: { type: String },
    city: { type: String },
    zipCode: { type: String },
    preferredJobTitle: { type: String },
    preferredJobLocation: { type: String },
    primarySkill: { type: String },
    secondarySkill: { type: String },
    yearsOfExperience: { type: String },
    summary: { type: String },
    workExperience: { type: String },
    linkedin: { type: String },
    github: { type: String },
    education: { type: String },
    cv: String,
    countries: [String],
    jobTitles: [String],
    applicationHistory: [String],
    dashboard: { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard" }, // Reference to the Dashboard model
  },
  { timestamps: true }
);
// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
export default mongoose.model("User", userSchema);
