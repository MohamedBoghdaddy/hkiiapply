import { useState } from "react";
import { useAuthContext } from "../context/AuthContext"; // Adjust path if necessary
import axios from "axios";

export const useSignup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
    
      const response = await axios.post(
        "http://localhost:4000/api/users/signup",
        {
          username,
          email,
          password,
          gender,
        },
        { withCredentials: true } // Ensure cookies are sent
      );

      setSuccessMessage("Registration successful");
      dispatch({ type: "REGISTRATION_SUCCESS", payload: response.data.user });
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    gender,
    setGender,
    errorMessage,
    successMessage,
    isLoading,
    handleSignup,
  };
};
