// // routes/subscriptionRoutes.js
// import express from "express";
// import {
//   createSubscription,
//   getSubscriptionPlans,
//   verifyPayment,
// } from "../controller/subscriptionController.js";
// import { auth, authorizeRoles } from "../Middleware/authMiddleware.js";

// const router = express.Router();
// router.use(auth);

// router.post("/create-subscription", auth, createSubscription); // Route to create a new subscription
// router.get("/subscription-plans", auth, getSubscriptionPlans); // Route to fetch available subscription plans
// router.post("/verify-payment",  verifyPayment); // Route to verify payment status

// export default router;
