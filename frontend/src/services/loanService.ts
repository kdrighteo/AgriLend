import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/loans`;

// Interface for loan application data
export interface LoanApplicationData {
  amount: number;
  purpose: string;
  description: string;
  termLength: number;
  termUnit: string;
  collateral?: string;
  cropType: string;
  farmingCycle: string;
  estimatedYield?: number;
  estimatedRevenue?: number;
  revenueUnit?: string;
}

// Interface for loan review data
export interface LoanReviewData {
  status: string;
  adminNotes?: string;
  riskScore?: number;
  approvedAmount?: number;
  rejectReason?: string;
}

// Submit loan application
export const submitLoanApplication = async (loanData: LoanApplicationData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, loanData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Get all loans for the logged-in farmer
export const getFarmerLoans = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/my-loans`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Get all loans (admin and superadmin only)
export const getAllLoans = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Authentication required');
    }
    
    // Add debugging info for token
    console.log('Using token for loans request (first 20 chars):', token.substring(0, 20) + '...');
    
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Retrieved ${response.data?.length || 0} loans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    // Rethrow with more context
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch loans: ${error.response?.status} ${error.response?.statusText}. ${error.response?.data?.message || ''}`);
    }
    throw error;
  }
};

// Get a specific loan by ID
export const getLoanById = async (loanId: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${loanId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Update loan status (admin only)
export const updateLoanStatus = async (loanId: string, reviewData: LoanReviewData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/${loanId}/status`,
    reviewData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data;
};

// Mark loan as repaid (admin only)
export const markLoanRepaid = async (loanId: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/${loanId}/repaid`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data;
};

// Mark loan as funded (admin only)
export const markLoanFunded = async (loanId: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/${loanId}/funded`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return response.data;
};
