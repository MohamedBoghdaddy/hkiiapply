import { useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { deleteCookie } from "../utils/cookieUtils";

const apiUrl = process.env.REACT_APP_API_URL;
const localUrl = "http://localhost:4000";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${
          process.env.NODE_ENV === "production" ? apiUrl : localUrl
        }/api/users/logout`,
        {},
        { withCredentials: true }
      );

      dispatch({ type: "LOGOUT_SUCCESS" });

      // Clear cookies
      deleteCookie("username");
      deleteCookie("email");
      deleteCookie("userId");

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [dispatch]);

  return { logout };
};
