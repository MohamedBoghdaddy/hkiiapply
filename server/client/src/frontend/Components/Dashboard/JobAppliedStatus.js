import React, { useContext, useEffect } from "react";
import { DashboardContext } from "./context/DashboardContext";

import "../styles/JobApplication.css";

const JobApplications = () => {
  const { appliedJobs, fetchAppliedJobs } = useContext(DashboardContext);

  useEffect(() => {
    const userId = "some-user-id"; // Replace with actual user ID
    fetchAppliedJobs(userId);
  }, [fetchAppliedJobs]);


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
