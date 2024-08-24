import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("your_stripe_public_key");

function SubscribeButton() {
  const handleClick = async () => {
    const {
      data: { id },
    } = await axios.post("/create-checkout-session");
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: id });
    if (error) {
      console.error(error);
    }
  };

  return <button onClick={handleClick}>Subscribe</button>;
}

export default SubscribeButton;
