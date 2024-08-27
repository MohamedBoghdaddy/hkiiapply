import mongoose from "mongoose";

const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    zipCode: { type: String },
    preferredJobTitle: { type: String },
    preferredJobLocation: { type: String },
    desiredSalary: { type: String },
    cvFileName: { type: String },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
