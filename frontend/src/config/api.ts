// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// For debugging API connectivity issues
console.log("Using API URL:", API_BASE_URL);

// Helper function to test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log("API health check response:", data);
    return response.ok;
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
};

export default API_BASE_URL;
