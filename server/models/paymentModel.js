import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, required: true },
  planAmount: { type: Number, required: true },
  discountAmount: { type: Number, required: false },
  totalPayment: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, required: true },
  subscriptionStatus: { type: String, required: true },
  subscriptionEndDate: { type: Date, required: true },
  remainingDays: { type: Number, required: true },
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
