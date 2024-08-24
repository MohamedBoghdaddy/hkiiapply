import React, { useState, useEffect, useContext } from "react";
import { AdminDashboardContext } from "../../../context/AdminDashboardContext";
import "../styles/UserProfile.css";
import { useAuthContext } from "../../../context/AuthContext";

const UserProfile = () => {
  const { userProfile, fetchUserProfile, updateProfile } = useContext(
    AdminDashboardContext
  );
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userProfile) {
          await fetchUserProfile();
          setFormData(userProfile || {});
        } else {
          setFormData(userProfile);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchData();
  }, [fetchUserProfile, userProfile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCvUpload = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData, cvFile);
      alert("Profile updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile">
      <h1>Profile Setup</h1>
      <button onClick={() => setIsEditMode(!isEditMode)}>
        {isEditMode ? "Cancel" : "Edit Profile"}
      </button>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="personal-info">
          <h4>Personal Information</h4>
          {isEditMode ? (
            <>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Middle Name"
                name="middleName"
                value={formData.middleName || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
              />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <p>First Name: {formData.firstName}</p>
              <p>Middle Name: {formData.middleName}</p>
              <p>Last Name: {formData.lastName}</p>
              <p>Email: {formData.email}</p>
              <p>Phone: {formData.phone}</p>
            </>
          )}
        </div>

        {/* Location Information */}
        <div className="location-info">
          <h4>Location Information</h4>
          {isEditMode ? (
            <>
              <input
                type="text"
                placeholder="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1 || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2 || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="City"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="State"
                name="state"
                value={formData.state || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="ZIP Code"
                name="zip"
                value={formData.zip || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Country"
                name="country"
                value={formData.country || ""}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <p>Address Line 1: {formData.addressLine1}</p>
              <p>Address Line 2: {formData.addressLine2}</p>
              <p>City: {formData.city}</p>
              <p>State: {formData.state}</p>
              <p>ZIP Code: {formData.zip}</p>
              <p>Country: {formData.country}</p>
            </>
          )}
        </div>

        {/* Job Preferences */}
        <div className="job-preferences">
          <h4>Job Preferences</h4>
          {isEditMode ? (
            <>
              <input
                type="text"
                placeholder="Preferred Job Titles"
                name="preferredJobTitles"
                value={formData.preferredJobTitles || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Preferred Job Locations"
                name="preferredJobLocations"
                value={formData.preferredJobLocations || ""}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Desired Salary"
                name="desiredSalary"
                value={formData.desiredSalary || ""}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <p>Preferred Job Titles: {formData.preferredJobTitles}</p>
              <p>Preferred Job Locations: {formData.preferredJobLocations}</p>
              <p>Desired Salary: {formData.desiredSalary}</p>
            </>
          )}
        </div>

        {/* CV Upload */}
        <div className="cv-upload">
          <h4>Upload CV</h4>
          {isEditMode ? (
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              onChange={handleCvUpload}
            />
          ) : (
            <p>CV: {formData.cvFileName}</p>
          )}
        </div>

        {isEditMode && <button type="submit">Save Changes</button>}
      </form>
    </div>
  );
};

export default UserProfile;
