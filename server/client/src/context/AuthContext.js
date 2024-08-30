import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
const localUrl = "http://localhost:4000";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "USER_LOADED":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "AUTH_ERROR":
      return { ...state, user: null, isAuthenticated: false, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = useCallback(async () => {
    try {
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || localStorage.getItem("token");

      if (token && !state.isAuthenticated) {
        const response = await axios.get(
          `${
            process.env.NODE_ENV === "production" ? apiUrl : localUrl
          }/api/users/checkAuth`,
          {
            withCredentials: true,
          }
        );
        const { user } = response.data;
        if (user) {
          dispatch({ type: "USER_LOADED", payload: user });
        } else {
          dispatch({ type: "AUTH_ERROR" });
        }
      } else if (!token) {
        dispatch({ type: "AUTH_ERROR" });
      }
    } catch (error) {
      console.error("Auth check failed", error);
      dispatch({ type: "AUTH_ERROR" });
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const { token, user } = JSON.parse(storedUser);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        dispatch({ type: "AUTH_ERROR" });
      }
    } else {
      checkAuth();
    }
  }, [checkAuth]);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
