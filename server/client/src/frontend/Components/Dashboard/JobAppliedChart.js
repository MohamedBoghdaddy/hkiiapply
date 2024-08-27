import React, { useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { DashboardContext } from "./context/DashboardContext";
import { useAuthContext } from "./context/AuthContext"; // Import the AuthContext
import "../styles/JobAppliedChart.css";

const JobAppliedChart = () => {
  const { appliedJobs, fetchAppliedJobs } = useContext(DashboardContext);
  const { state } = useAuthContext(); // Get the auth state

  useEffect(() => {
    if (state.user && state.user.id) {
      fetchAppliedJobs(state.user.id); // Use the logged-in userId
    }
  }, [fetchAppliedJobs, state.user]);

  const jobData = appliedJobs.map((job) => ({
    month: new Date(job.appliedDate).toLocaleString("default", {
      month: "long",
    }),
    count: job.status === "applied" ? 1 : 0,
  }));

  const data = {
    labels: jobData.length ? jobData.map((job) => job.month) : ["No Data"],
    datasets: [
      {
        label: "Jobs Applied",
        data: jobData.length ? jobData.map((job) => job.count) : [0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Jobs Applied Per Month" },
    },
  };

  return <Bar data={data} options={options} />;
};

export default JobAppliedChart;
