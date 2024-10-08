import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { setCookie } from "../utils/cookieUtils";

const apiUrl = process.env.REACT_APP_API_URL;
const localUrl = "http://localhost:4000";

export const useLogin = () => {
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
        `${
          process.env.NODE_ENV === "production" ? apiUrl : localUrl
        }/api/users/login`,
        { email, password },
        { withCredentials: true }
      );

      const { token, refreshToken, user } = response.data;

      // Check if the response contains the required fields
      if (token && user) {
        // Store user and token in local storage
        localStorage.setItem(
          "user",
          JSON.stringify({ token, refreshToken, user })
        );
        // Dispatch login success action
        dispatch({ type: "LOGIN_SUCCESS", payload: user || {} });

        // Set success message
        setSuccessMessage("Login successful");

        // Set cookies
        setCookie("token", token);
        setCookie("username", user.username);
        setCookie("email", user.email);
        setCookie("userId", user.id);
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
