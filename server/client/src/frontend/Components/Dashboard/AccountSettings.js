import React, { useState, useEffect, useContext } from "react";
import { DashboardContext } from "../../../context/DashboardContext";
import Notification from "./Notification";
import "../styles/AccountSetting.css";

const AccountSettings = () => {
  const { accountSettings, updateAccountSettings } =
    useContext(DashboardContext); // Use useContext here
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (accountSettings) {
      setFormData({
        email: accountSettings.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [accountSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setNotification({ type: "error", message: "Passwords do not match" });
      return;
    }
    if (formData.password.length < 8) {
      setNotification({
        type: "error",
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    try {
      const response = await updateAccountSettings(formData);
      if (response && response.status === 200) {
        setNotification({
          type: "success",
          message: "Account settings updated successfully!",
        });
      } else {
        setNotification({
          type: "error",
          message:
            response?.data?.message || "Failed to update account settings",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "An error occurred while updating settings",
      });
    }
  };

  return (
    <div className="account-settings">
      <h1>Account Settings</h1>
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            id="Username"
            name="Username"
            value={formData.Username}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
};

export default AccountSettings;
