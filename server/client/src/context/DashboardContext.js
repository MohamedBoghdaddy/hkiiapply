import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
  const { state } = useAuthContext();
  const { user, isAuthenticated } = state;

  const [view, setView] = useState("profile");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    accountSettings: {},
    appliedJobs: [],
    userProfile: {},
    userId: null,
  });
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Fetch user data from the server
  const fetchUserData = useCallback(async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/profiles/get/${user._id}`,
          { withCredentials: true }
        );
        setUserData(response.data);
        setFormData(response.data.userProfile || {});
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile data.");
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  // Automatically fetch user data when the component mounts or when the dependencies change
  useEffect(() => {
    if (isAuthenticated && user && view === "profile") {
      fetchUserData();
    }
  }, [isAuthenticated, user, view, fetchUserData]);

  // Update user profile on the server
  const updateProfile = async (formData, cvFile, photoFile) => {
    if (!user || !user._id) {
      toast.error("User is not authenticated.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (cvFile) {
      formDataToSend.append("cvFile", cvFile);
    }

    if (photoFile) {
      formDataToSend.append("photoFile", photoFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/profiles/upsert/${user._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile updated successfully.", { position: "top-right" });
      setUserData((prevData) => ({
        ...prevData,
        userProfile: response.data.profile,
      }));
      setView("profile");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.error || "Failed to update profile.", {
        position: "top-right",
      });
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        view,
        setView,
        notifications,
        loading,
        userData,
        editingId,
        setEditingId,
        updateProfile,
        fetchUserData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
