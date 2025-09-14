// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel will handle routing
  : 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  
  // Customer endpoints
  CUSTOMERS: `${API_BASE_URL}/customers`,
  CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/customers/${id}`,
  
  // Lead endpoints
  LEADS: (customerId) => `${API_BASE_URL}/customers/${customerId}/leads`,
  LEAD_BY_ID: (customerId, leadId) => `${API_BASE_URL}/customers/${customerId}/leads/${leadId}`,
};

export default API_BASE_URL;
