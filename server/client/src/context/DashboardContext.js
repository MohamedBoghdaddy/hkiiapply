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
    if (user && user.id) {
      try {
        const response = await axios.get(
          `${
            process.env.NODE_ENV === "production" ? apiUrl : localUrl
          }/api/users/getone/${user.id}`,
          { withCredentials: true }
        );
        setUserData(response.data);
        setFormData(response.data || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
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
    if (!user || !user.id) {
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
      // Update the profile using /api/profiles/upsert/
      const profileResponse = await axios.put(
        `${
          process.env.NODE_ENV === "production" ? apiUrl : localUrl
        }/api/profiles/upsert/${user.id}`, // First API call to update the profile
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile response:", profileResponse); // Log profile response for debugging

      // Update the user using /api/users/upsert/
      const userResponse = await axios.put(
        `${
          process.env.NODE_ENV === "production" ? apiUrl : localUrl
        }/api/users/upsert/${user.id}`, // Second API call to update the user
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success for both requests
      toast.success("Profile and user updated successfully.", {
        position: "top-right",
      });

      // Update the state based on the user data returned from the API
      setUserData((prevData) => ({
        ...prevData,
        userProfile: userResponse.data.user, // Updated user data
      }));

      // Extract non-sensitive data (e.g., email, role)
      const nonSensitiveData = {
        firstName: userResponse.data.user.firstName,

        email: userResponse.data.user.email,
        username: userResponse.data.user.username,
        role: userResponse.data.user.role,
      };

      // Save non-sensitive data in localStorage
      localStorage.setItem("userInfo", JSON.stringify(nonSensitiveData));

      setView("profile");
      clearNotifications(); // Clear notifications after successful update
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.error || "Failed to update profile or user.",
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
      clearNotifications,
      // Adding the clearNotifications to the context
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
