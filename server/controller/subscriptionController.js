// // paymentController.js
// import Razorpay from "razorpay";
// import { Subscription } from "../models/Subscription.js";
// import {
//   fetchPlanDetails,
//   fetchAvailablePlans,
// } from "./paymentController.js";

// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const createSubscription = async (req, res) => {
//   const { planId } = req.body;

//   try {
//     const plan = fetchPlanDetails(planId); // Ensure this function is defined
//     const options = {
//       amount: plan.amount,
//       currency: "USD",
//     };
//     const order = await instance.orders.create(options);
//     const subscription = await Subscription.create({
//       userId: req.user._id,
//       planId,
//       orderId: order.id,
//       status: "PENDING",
//     });

//     res.status(200).json(order);
//   } catch (error) {
//     console.error("Failed to create subscription:", error);
//     res.status(500).json({ message: "Failed to create subscription", error });
//   }
// };

// const getSubscriptionPlans = async (req, res) => {
//   try {
//     const plans = fetchAvailablePlans(); // Ensure this function is defined
//     res.status(200).json(plans);
//   } catch (error) {
//     console.error("Failed to fetch subscription plans:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch subscription plans", error });
//   }
// };

// const verifyPayment = async (req, res) => {
//   const { orderId, paymentId, signature } = req.body;

//   try {
//     const payment = await instance.payments.fetch(paymentId);
//     if (payment.status === "captured" && payment.order_id === orderId) {
//       await Subscription.findOneAndUpdate({ orderId }, { status: "ACTIVE" });
//       res.status(200).json({ message: "Payment verified successfully" });
//     } else {
//       res.status(400).json({ message: "Payment verification failed" });
//     }
//   } catch (error) {
//     console.error("Payment verification failed:", error);
//     res.status(500).json({ message: "Payment verification failed", error });
//   }
// };

// export { createSubscription, getSubscriptionPlans, verifyPayment };
