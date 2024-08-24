import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import DashboardProvider from "./context/DashboardContext";
import axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import EmployeeProvider from "./context/EmployeeContext";
// import AdminDashboardProvider from "./context/AdminDashboardContext";

// Create a root container
const container = document.getElementById("root");
const root = createRoot(container);




// Render the App component
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DashboardProvider>
        {/* <AdminDashboardProvider> */}
          <EmployeeProvider>
            <App />
          </EmployeeProvider>
        {/* </AdminDashboardProvider> */}
      </DashboardProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
