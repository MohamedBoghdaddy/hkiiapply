import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "../styles/JobAppliedChart.css";

// Register necessary components for ChartJS
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const JobAppliedChart = ({ jobData }) => {
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
