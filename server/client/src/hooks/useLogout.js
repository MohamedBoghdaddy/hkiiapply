import { useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { deleteCookie } from "../utils/cookieUtils"; // Import your cookie utility

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = useCallback(async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/users/logout",
        {},
        { withCredentials: true } // Ensure cookies are sent
      );

      dispatch({ type: "LOGOUT_SUCCESS" }); // Update the action type to match your reducer

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
