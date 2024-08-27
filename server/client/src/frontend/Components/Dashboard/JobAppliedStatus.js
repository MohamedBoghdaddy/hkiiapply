import React, { useContext, useEffect } from "react";
import { DashboardContext } from "./context/DashboardContext";
import { useAuthContext } from "./context/AuthContext"; // Import the AuthContext
import "../styles/JobApplication.css";

const JobApplications = () => {
  const { appliedJobs, fetchAppliedJobs } = useContext(DashboardContext);
  const { state } = useAuthContext(); // Get the auth state

  useEffect(() => {
    if (state.user && state.user.id) {
      fetchAppliedJobs(state.user.id); // Use the logged-in userId
    }
  }, [fetchAppliedJobs, state.user]);

  return (
    <div className="job-applications">
      <h3>Applied Jobs</h3>
      <ul>
        {appliedJobs.map((job) => (
          <li key={job.id}>
            <h4>{job.title}</h4>
            <p>{job.company}</p>
            <p>{job.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobApplications;
