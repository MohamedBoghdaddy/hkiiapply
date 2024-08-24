import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
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

        // Ensure that data.labels and data.values are defined and arrays
        const labels = data.labels || [];
        const values = data.values || [];
        
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
      <div className="main">
        <div className="main-top">
          <h1>Dashboard</h1>
          <span className="material-symbols-rounded">account_circle</span>
        </div>
        {/* <div className="users">
          <div className="card">
            <span className="material-symbols-rounded">trending_up</span>
            <span className="nav-item">Income</span>
            <h4>9380$</h4>
            <p>Objective Income</p>
            <div className="per">
              <table>
                <thead>
                  <tr>
                    <td>
                      <span>85%</span>
                    </td>
                    <td>
                      <span>87%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Monthly</td>
                    <td>Yearly</td>
                  </tr>
                </thead>
              </table>
            </div>
            <button>View</button>
          </div>
          <div className="card">
            <span className="material-symbols-rounded">chat</span>
            <span className="nav-item">Message</span>
            <h4>5 New Messages</h4>
            <div className="per">
              <table>
                <thead>
                  <tr>
                    <td>
                      <span className="sender">Dr. Ayman Ali:</span>
                    </td>
                    <td>
                      <span className="message">Hi Doctor</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="sender">Omar Ahmed:</span>
                    </td>
                    <td>
                      <span className="message">
                        Hello Doctors, Thank you for the vaccination for my dog
                      </span>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
            <h4>+3 More</h4>
            <button>More Details</button>
          </div>
        </div> */}
        <h2>User Data</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
