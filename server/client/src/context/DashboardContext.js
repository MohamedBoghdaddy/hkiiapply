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

  const fetchUserData = useCallback(async () => {
    try {
      if (user && user._id) {
        const response = await axios.get(
          `http://localhost:4000/api/users/getone/${user._id}`,
          {
            withCredentials: true,
          }
        );
        setUserData(response.data);
        setFormData(response.data.userProfile || {});
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user && view === "profile") {
      fetchUserData();
    }
  }, [isAuthenticated, user, view, fetchUserData]);

  const updateProfile = async (formData, cvFile, photoFile) => {
    if (editingId) {
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
          `http://localhost:4000/api/users/update/${editingId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(response.data.msg, { position: "top-right" });
        setUserData((prevData) => ({
          ...prevData,
          userProfile: response.data.user,
        }));
        setView("profile");
      } catch (error) {
        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error, { position: "top-right" });
        } else {
          console.error("Error submitting form:", error);
        }
      }
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
