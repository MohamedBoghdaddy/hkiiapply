// src/context/AdminDashboardContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

export const AdminDashboardContext = createContext();

const AdminDashboardProvider = ({ children }) => {
    const { state } = useAuthContext();

    const { user, isAuthenticated } = state;
  const [accountSettings, setAccountSettings] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchAccountSettings();
    fetchUserProfile();
  }, []);

  const fetchAccountSettings = async () => {
    try {
      const response = await axios.get("/api/account-settings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAccountSettings(response.data);
    } catch (error) {
      console.error("Error fetching account settings:", error);
    }
  };

  const updateAccountSettings = async (formData) => {
    try {
      const response = await axios.put("/api/account-settings", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAccountSettings(response.data);
      return response;
    } catch (error) {
      console.error("Error updating account settings:", error);
      return error.response;
    }
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get("/api/user-profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []);

  useEffect(() => {
    fetchAccountSettings();
    fetchUserProfile();
  }, [fetchAccountSettings, fetchUserProfile]);


  const updateProfile = async (formData) => {
    try {
      const response = await axios.put("/api/user-profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserProfile(response.data);
      return response;
    } catch (error) {
      console.error("Error updating profile:", error);
      return error.response;
    }
  };

  return (
    <AdminDashboardContext.Provider
      value={{
        accountSettings,
        updateAccountSettings,
        userProfile,
        fetchUserProfile,
        updateProfile,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
};

export default AdminDashboardProvider;
