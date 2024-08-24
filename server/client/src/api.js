import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000", // Update with your server's URL
  withCredentials: true,
});

// Authentication functions

export const login = async (email, password) => {
  const response = await API.post("/login", { email, password });
  return response.data;
};

export const signup = async (userData) => {
  const response = await API.post("/signup", userData);
  return response.data;
};

export const logout = async () => {
  const response = await API.post("/logout");
  return response.data;
};

export const getUser = async () => {
  const response = await API.get("/api/users/getone/:userId");
  return response.data;
};
