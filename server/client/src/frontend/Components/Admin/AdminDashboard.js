import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Notification from "./Notification";
import Sidebar from "../Dashboard/Sidebar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/chart-data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = response.data;

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "User Data",
              data: data.values,
              backgroundColor: "rgba(75,192,192,1)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="main-top">
          <h1>Dashboard</h1>
          <span className="material-symbols-rounded">account_circle</span>
        </div>
        <h2>User Data</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
