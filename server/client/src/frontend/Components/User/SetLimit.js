import React, { useState } from "react";
import axios from "axios";

function SetLimit() {
  const [limit, setLimit] = useState(4000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      "/set-limit",
      { job_limit: limit },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
      />
      <button type="submit">Set Job Limit</button>
    </form>
  );
}

export default SetLimit;
