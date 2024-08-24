// // paymentController.js
// import crypto from "crypto";
// import Razorpay from "razorpay";
// import Payment from "../models/paymentModel.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const razorpayWebhook = (req, res) => {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   const signature = req.headers["x-razorpay-signature"];
//   const body = req.body;

//   const generatedSignature = crypto
//     .createHmac("sha256", secret)
//     .update(JSON.stringify(body))
//     .digest("hex");

//   if (generatedSignature === signature) {
//     const payment = new Payment({
//       userId: body.payload.payment.entity.account_id,
//       plan: body.payload.payment.entity.plan,
//       planAmount: body.payload.payment.entity.amount / 100,
//       discountAmount: 0,
//       totalPayment: body.payload.payment.entity.amount / 100,
//       paymentMethod: body.payload.payment.entity.method,
//       paymentDate: new Date(),
//       paymentStatus: body.payload.payment.entity.status,
//       subscriptionStatus: "Active",
//       subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//       remainingDays: 30,
//       razorpay_order_id: body.payload.payment.entity.order_id,
//       razorpay_payment_id: body.payload.payment.entity.id,
//       razorpay_signature: signature,
//     });

//     payment
//       .save()
//       .then(() => res.status(200).json({ status: "success" }))
//       .catch((err) =>
//         res.status(500).json({ status: "failed", error: err.message })
//       );
//   } else {
//     res.status(400).json({ status: "failed", message: "Invalid signature" });
//   }
// };

// export const createOrder = async (req, res) => {
//   const { amount, currency } = req.body;
//   try {
//     const options = {
//       amount: amount * 100,
//       currency: currency,
//       receipt: "receipt#1",
//     };
//     const order = await razorpay.orders.create(options);
//     res.json(order);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to create order", error: error.message });
//   }
// };

// // Add this if `createSubscription` is indeed in this file
// export const createSubscription = (req, res) => {
//   // Implementation here
// };

// // Other functions
// const fetchPlanDetails = (planId) => {
//   // Mock function or actual implementation to get plan details
//   return {
//     amount: 1000, // Example amount
//   };
// };

// const fetchAvailablePlans = () => {
//   // Mock function or actual implementation to get available plans
//   return [
//     { id: "plan1", name: "Basic Plan", amount: 10 },
//     { id: "plan2", name: "Premium Plan", amount: 15 },
//   ];
// };

// export { fetchPlanDetails, fetchAvailablePlans };
