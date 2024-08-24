// models/AccountSettingsModel.js
import mongoose from "mongoose";

const accountSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Add other settings fields as required
  theme: {
    type: String,
    default: "light",
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  // Add any other fields you need for the settings
});

const AccountSettings = mongoose.model(
  "AccountSettings",
  accountSettingsSchema
);

export default AccountSettings;
