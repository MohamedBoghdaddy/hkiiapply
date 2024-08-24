import React, { useEffect, useState } from "react";
import axios from "axios";
import world from "../static/images/world.svg"; // Ensure the path is correct
import "../styles/map.css"; // Ensure the path is correct

const GlobalMap = () => {
  const [jobsByCountry, setJobsByCountry] = useState({
    USA: 100, // Static data for demonstration
    Canada: 50, // Static data for demonstration
    Egypt: 30, // Static data for demonstration
    Germany: 75, // Static data for demonstration
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/jobs/countries");
        setJobsByCountry((prevJobs) => ({
          ...prevJobs,
          ...response.data,
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs data:", error);
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
    // Here you can add more logic, like fetching detailed job data for the selected country
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>Where We Go For Jobs</h1>
        <p>These are Real-Time available Job Insights for the current week!</p>
      </div>
      {loading ? (
        <div>Loading map...</div>
      ) : (
        <div className="svg-map">
          <img src={world} alt="World Map" useMap="#world-map" />
          <map name="world-map">
            {Object.entries(jobsByCountry).map(([country, jobCount], index) => (
              <area
                key={index}
                shape="poly" // Adjust shape if necessary, depending on the SVG
                coords="..." // Add coordinates corresponding to the country's region in the SVG
                alt={country}
                title={`${country}: ${jobCount} jobs`}
                onClick={() => handleCountryClick(country)}
                href="#"
              />
            ))}
          </map>
        </div>
      )}
      {selectedCountry && (
        <div className="country-info">
          <h2>{selectedCountry}</h2>
          <p>Available jobs: {jobsByCountry[selectedCountry] || 0}</p>
        </div>
      )}
    </div>
  );
};

export default GlobalMap;
