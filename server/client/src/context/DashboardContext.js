import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const apiUrl = process.env.REACT_APP_API_URL;
const localUrl = "http://localhost:4000";

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch user data from the server
  const fetchUserData = useCallback(async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(
          `${
            process.env.NODE_ENV === "production" ? apiUrl : localUrl
          }/api/profiles/get/${user._id}`,
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

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Example usage of setNotifications to clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Update user profile on the server, wrapped in useCallback
  const updateProfile = useCallback(
    async (formData, cvFile, photoFile) => {
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
          `${
            process.env.NODE_ENV === "production" ? apiUrl : localUrl
          }/api/profiles/upsert/${user._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Profile updated successfully.", {
          position: "top-right",
        });
        setUserData((prevData) => ({
          ...prevData,
          userProfile: response.data.profile,
        }));
        setView("profile");
        clearNotifications(); // Clear notifications after successful update
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(
          error.response?.data?.error || "Failed to update profile.",
          {
            position: "top-right",
          }
        );
      }
    },
    [user]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      view,
      setView,
      notifications,
      setNotifications, // Ensure setNotifications is available in context
      loading,
      userData,
      formData, // Adding formData to the context value
      editingId,
      setEditingId,
      updateProfile,
      handleInputChange, // Adding the input handler to the context
      fetchUserData,
      clearNotifications, // Adding the clearNotifications to the context
    }),
    [
      view,
      notifications,
      loading,
      userData,
      formData,
      editingId,
      fetchUserData,
      updateProfile,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// PropTypes validation
DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardProvider;
