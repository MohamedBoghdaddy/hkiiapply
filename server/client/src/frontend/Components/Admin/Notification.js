// src/components/Notification.js
import React from "react";
import "../styles/Notifications.css"; // Make sure to create this CSS file

const Notification = ({ type, message }) => {
  return <div className={`notification ${type}`}>{message}</div>;

};

export default Notification;
