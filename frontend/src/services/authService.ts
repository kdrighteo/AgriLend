import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Updated import syntax
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/auth`;

// Token validation
interface DecodedToken {
  exp: number;
  userId: string;
  role: string;
  [key: string]: any;
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // If there's an error, treat token as expired
  }
};

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

// Get current user with token validation
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return null;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // Token is expired, remove user data and token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  
  // Token is valid, return user data
  return JSON.parse(userStr);
};

// Setup axios interceptor for JWT token
export const setupAxiosInterceptors = () => {
  // Remove existing interceptors to prevent duplicates
  axios.interceptors.request.eject(0);
  axios.interceptors.response.eject(0);
  
  // Add request interceptor with token validation
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      
      // Only add token if it exists and isn't expired
      if (token) {
        if (isTokenExpired(token)) {
          // Token is expired, trigger logout
          console.log('Token expired during request, logging out');
          logout();
          window.location.href = '/login';
          // Don't add the expired token to the request
        } else {
          // Valid token, add to headers
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle auth errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error?.response?.status, error?.response?.data);
      
      if (error.response) {
        // Handle unauthorized errors (invalid/expired token)
        if (error.response.status === 401) {
          console.log('Received 401 error, logging out');
          logout();
          window.location.href = '/login';
        }
        
        // Handle forbidden errors (insufficient permissions)
        if (error.response.status === 403) {
          console.log('Received 403 error, redirecting to home');
          window.location.href = '/';
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  console.log('Axios interceptors successfully set up');
};
