import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  farmName?: string;
  farmLocation?: string;
  farmSize?: number;
  farmSizeUnit?: string;
  phoneNumber?: string;
  farmingExperience?: number;
  mainCrops?: string[];
  creditScore?: number;
}

interface FarmerRegistrationData {
  name: string;
  email: string;
  password: string;
  farmName: string;
  farmLocation: string;
  farmSize?: number;
  farmSizeUnit?: string;
  phoneNumber: string;
  farmingExperience?: number;
  mainCrops?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: FarmerRegistrationData) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Setup axios interceptors
    authService.setupAxiosInterceptors();
    
    // Check if user is logged in
    const checkLoggedIn = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsLoading(false);
      
      // Redirect based on user role
      console.log('Redirecting based on role:', data.user.role);
      if (data.user.role === 'superadmin') {
        console.log('Navigating to super-admin dashboard');
        // Add small delay to ensure navigation happens after auth state is set
        setTimeout(() => {
          navigate('/super-admin-dashboard');
        }, 100); // Super admin dashboard
      } else if (data.user.role === 'admin') {
        navigate('/admin-dashboard'); // Admin dashboard
      } else if (data.user.role === 'farmer') {
        navigate('/farmer-dashboard'); // Farmer dashboard
      } else {
        navigate('/'); // Default route for other roles
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (farmerData: FarmerRegistrationData) => {
    try {
      setIsLoading(true);
      const data = await authService.register(farmerData);
      setUser(data.user);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => React.useContext(AuthContext);
