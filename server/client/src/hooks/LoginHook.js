import { useState } from "react";
import { useAuthContext } from "../context/AuthContext"; // Adjust path if necessary
import axios from "axios";
import { setCookie } from "../utils/cookieUtils"; // Import your cookie utility

export const useLogin = (onLoginSuccess) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = response.data;

      localStorage.setItem("user", JSON.stringify({ token, user }));

    if (token && user) {
      dispatch({ type: "LOGIN_SUCCESS", payload: user || {} });
      setSuccessMessage("Login successful");
      onLoginSuccess();

      // Set cookies
      setCookie("token", token);

      if (user) {
        setCookie("username", user.username);
        setCookie("email", user.email);
        setCookie("userId", user._id);
      }
    } else {
      console.error("Unexpected response format:", response.data);
      throw new Error("Invalid response data");
    }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    errorMessage,
    successMessage,
    isLoading,
    handleLogin,
  };
};
