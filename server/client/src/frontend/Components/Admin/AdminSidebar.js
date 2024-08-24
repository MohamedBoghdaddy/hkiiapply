import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHistory, FaCog, FaBell } from "react-icons/fa";
import "../styles/Sidebar.css";
import { useAuthContext } from "../../../context/AuthContext";

const Sidebar = () => {
  const { user, isAuthenticated } = useAuthContext();

  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>
          {isAuthenticated && user ? `Welcome, ${user.username}` : "Guest"}
        </h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <FaUser /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUser /> Profile
          </Link>
        </li>
          <li>
            <Link to="/EmployeeList">
              <FaUser /> Employee List
            </Link>
          </li>
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
