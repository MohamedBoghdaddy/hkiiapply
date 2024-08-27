import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHistory, FaCog, FaBell } from "react-icons/fa";
import "../styles/Sidebar.css";
import { useAuthContext } from "../../../context/AuthContext";

const Sidebar = () => {
  const { state } = useAuthContext();
  const { user, isAuthenticated } = state;

  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>
          {isAuthenticated && user ? `Welcome, ${user.username}` : "Guest"}
        </h2>
        {isAuthenticated && user && user.photoUrl && (
          <img
            src={`http://localhost:4000${user.photoUrl}`} // Adjust based on your backend setup
            alt="Profile"
            className="sidebar-profile-pic"
          />
        )}
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/Dashboard">
            <FaUser /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUser /> Profile
          </Link>
        </li>

        {/* Conditionally render Employee List for admin users only */}
        {isAuthenticated && user.role === "admin" && (
          <li>
            <Link to="/EmployeeList">
              <FaUser /> Employee List
            </Link>
          </li>
        )}
        {isAuthenticated && user.role === "user" && (
          <li>
            <Link to="/JobHistory">
              <FaHistory /> Job History
            </Link>
          </li>
        )}
        {isAuthenticated && user.role === "user" && (
          <li>
            <Link to="/ApplyToJobs">
              <FaHistory /> Apply to Jobs
            </Link>
          </li>
        )}
        {isAuthenticated && user.role === "user" && (
          <li>
            <Link to="/PaymentHistory">
              <FaHistory /> Payment History
            </Link>
          </li>
        )}
        <li>
          <Link to="/AccountSettings">
            <FaCog /> Account Settings
          </Link>
        </li>
        <li>
          <Link to="/notifications">
            <FaBell /> Notifications
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(Sidebar);
