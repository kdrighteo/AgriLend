import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "../styles/Profile.css";
import API_BASE_URL from "../config/api";

interface ProfileFormData {
  name: string;
  email: string;
  farmName?: string;
  farmLocation?: string;
  farmSize?: string;
  farmSizeUnit?: string;
  phoneNumber?: string;
  farmingExperience?: string;
  mainCrops?: string;
}

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    farmName: "",
    farmLocation: "",
    farmSize: "",
    farmSizeUnit: "acres",
    phoneNumber: "",
    farmingExperience: "",
    mainCrops: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        farmName: user.farmName || "",
        farmLocation: user.farmLocation || "",
        farmSize: user.farmSize?.toString() || "",
        farmSizeUnit: user.farmSizeUnit || "acres",
        phoneNumber: user.phoneNumber || "",
        farmingExperience: user.farmingExperience?.toString() || "",
        mainCrops: Array.isArray(user.mainCrops)
          ? user.mainCrops.join(", ")
          : "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear success and error messages when user starts typing
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Prepare submission data
      const submissionData: any = {
        name: formData.name,
        email: formData.email,
      };

      // Add farmer-specific fields if user is a farmer
      if (user?.role === "farmer") {
        submissionData.farmName = formData.farmName;
        submissionData.farmLocation = formData.farmLocation;
        submissionData.farmSize = formData.farmSize
          ? parseFloat(formData.farmSize)
          : undefined;
        submissionData.farmSizeUnit = formData.farmSizeUnit;
        submissionData.phoneNumber = formData.phoneNumber;
        submissionData.farmingExperience = formData.farmingExperience
          ? parseInt(formData.farmingExperience)
          : undefined;
        submissionData.mainCrops = formData.mainCrops
          ? formData.mainCrops.split(",").map((crop) => crop.trim())
          : [];
      }

      const response = await axios.put(
        `${API_BASE_URL}/auth/profile`,
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setSuccess(true);
      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(response.data));
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="card-header">
          <h3 className="card-title">Profile Settings</h3>
          <p>Update your personal information</p>
        </div>

        <div className="card-body">
          {/* Success Message */}
          {success && (
            <div className="form-success" role="alert">
              <svg
                className="success-icon"
                width="20"
                height="20"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <p>Profile updated successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="form-error" role="alert">
              <svg
                className="error-icon"
                width="20"
                height="20"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <div className="input-group">
                  <svg
                    className="detail-icon"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  <svg
                    className="detail-icon"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Farmer-specific fields */}
            {user?.role === "farmer" && (
              <>
                <h4 className="section-divider">Farm Information</h4>
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label htmlFor="farmName" className="form-label">
                      Farm Name
                    </label>
                    <div className="input-group">
                      <svg
                        className="detail-icon"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        ></path>
                      </svg>
                      <input
                        type="text"
                        name="farmName"
                        id="farmName"
                        value={formData.farmName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Your farm name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="farmLocation" className="form-label">
                      Farm Location
                    </label>
                    <div className="input-group">
                      <svg
                        className="detail-icon"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <input
                        type="text"
                        name="farmLocation"
                        id="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="City, Region"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="farmSize" className="form-label">
                      Farm Size
                    </label>
                    <div className="input-group">
                      <svg
                        className="detail-icon"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        ></path>
                      </svg>
                      <input
                        type="number"
                        name="farmSize"
                        id="farmSize"
                        value={formData.farmSize}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Size"
                        min="0"
                        step="0.1"
                      />
                      <select
                        name="farmSizeUnit"
                        id="farmSizeUnit"
                        value={formData.farmSizeUnit}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    <div className="input-group">
                      <svg
                        className="detail-icon"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        ></path>
                      </svg>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="farmingExperience" className="form-label">
                      Farming Experience (years)
                    </label>
                    <div className="input-group">
                      <svg
                        className="detail-icon"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <input
                        type="number"
                        name="farmingExperience"
                        id="farmingExperience"
                        value={formData.farmingExperience}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Years of experience"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mainCrops" className="form-label">
                      Main Crops
                    </label>
                    <div className="input-group">
                      <svg
                        className="detail-icon"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        ></path>
                      </svg>
                      <input
                        type="text"
                        name="mainCrops"
                        id="mainCrops"
                        value={formData.mainCrops}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Corn, Wheat, Rice (comma separated)"
                      />
                    </div>
                    <small className="form-hint">
                      Separate multiple crops with commas
                    </small>
                  </div>
                </div>
              </>
            )}

            <div className="action-buttons">
              <button type="submit" disabled={loading} className="btn-save">
                {loading ? (
                  <>
                    <svg
                      className="loading-icon"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    user?.role === "superadmin"
                      ? "/super-admin-dashboard"
                      : user?.role === "admin"
                        ? "/admin-dashboard"
                        : "/dashboard",
                  )
                }
                className="btn-cancel"
              >
                Cancel
              </button>
              {user?.role === "superadmin" && (
                <button
                  type="button"
                  onClick={() => navigate("/super-admin-dashboard")}
                  className="btn-primary ml-2"
                  style={{ marginLeft: "10px", backgroundColor: "#4a37be" }}
                >
                  Go to Super Admin Dashboard
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
