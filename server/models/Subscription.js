import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  orderId: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["PENDING", "ACTIVE", "CANCELLED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
