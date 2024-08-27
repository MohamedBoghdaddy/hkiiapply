import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/JobsDashboard.css";

const JobsDashboard = ({ userId, cvText, preferences }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobHistory, setJobHistory] = useState([]);

  const handleApplyToJobs = async () => {
    setLoading(true);
    try {
      const result = await axios.post("http://localhost:5000/api/apply-jobs", {
        user_id: userId,
        cv_text: cvText,
        preferences: preferences,
      });
      setResponse(result.data);
      // Store job application history in local state
      setJobHistory([...jobHistory, result.data]);
    } catch (error) {
      console.error("Error applying to jobs:", error);
      alert("Failed to apply for jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobs-dashboard">
      <div className="apply-to-jobs">
        <h1>Apply to Jobs</h1>
        <button
          className={`apply-button ${loading ? "loading" : ""}`}
          onClick={handleApplyToJobs}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Applying...
            </>
          ) : (
            "Apply to Jobs"
          )}
        </button>
        {response && (
          <div className="application-response">
            <h3>Job Application Successful!</h3>
            <p>
              <strong>Company Name:</strong> {response.companyName}
            </p>
            <p>
              <strong>Job Title:</strong> {response.jobTitle}
            </p>
            <p>
              <strong>Location:</strong> {response.location}
            </p>
            <p>
              <strong>Job Description:</strong> {response.jobDescription}
            </p>
            <p>
              <strong>Applied Date:</strong>{" "}
              {new Date(response.appliedDate).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Display job application history */}
      <div className="job-history">
        <h1>Job History</h1>
        <table>
          <thead>
            <tr>
              <th>Job Applied Date</th>
              <th>Company Name</th>
              <th>Job Title</th>
              <th>Location</th>
              <th>Job Description</th>
            </tr>
          </thead>
          <tbody>
            {jobHistory.map((job, index) => (
              <tr key={index}>
                <td>{new Date(job.appliedDate).toLocaleDateString()}</td>
                <td>{job.companyName}</td>
                <td>{job.jobTitle}</td>
                <td>{job.location}</td>
                <td>
                  <a href="#view">VIEW</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsDashboard;
