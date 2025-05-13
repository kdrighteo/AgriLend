import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Interface for farmer registration data
interface FarmerRegistrationData {
  name: string;
  email: string;
  password: string;
  farmName?: string;
  farmLocation?: string;
  farmSize?: number;
  farmSizeUnit?: string;
  phoneNumber?: string;
  farmingExperience?: number;
  mainCrops?: string[];
}

// Register farmer
export const register = async (farmerData: FarmerRegistrationData) => {
  const response = await axios.post(`${API_URL}/register`, farmerData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

// Setup axios interceptor for JWT token
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle 401 errors (unauthorized)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Auto logout if 401 response returned from api
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
