// API endpoint configurations
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/signin',
    SIGNUP: '/signup',
    CHECK_AUTH: '/auth/me', 
    SIGNOUT: '/signout',        
    FORGOT_PASSWORD: '/forgot-password',
  },
  JOBS: {
    LIST: '/jobs',
    CREATE: '/jobs',
    UPDATE: 'jobs/:id',
    DELETE: 'jobs/:id',
    APPLY: 'jobs/:id/apply',
  },
  USER: {
    PROFILE: 'user/profile',
    UPDATE_PROFILE: 'user/profile/update',
    APPLICATIONS: 'user/applications',
    SAVED_JOBS: 'user/saved-jobs',
  },
  NOTIFICATIONS: {
    LIST: 'notifications',
    MARK_READ: 'notifications/mark-read',
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2622/api/v1.0.0';

import axios from 'axios';

export const mockApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },
  
  signup: async (userData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'An error occurred during signup' 
      };
    }
  },
  
  getJobs: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`);
      return response.data.data;
    } catch (error) {
      return { success: false };
    }
  },

  applyJob: async (jobId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/jobs/apply`,
        { jobId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return { success: false };
    }
  },

  createJob: async (jobData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.JOBS.CREATE}`,
        jobData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Job creation error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Job posting failed'
      };
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.CHECK_AUTH}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return { 
        success: false,
        message: error.response?.data?.message || 'Not authenticated' 
      };
    }
  },

  signout: async () => {
    try {
      await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNOUT}`,
        {},
        { withCredentials: true }
      );
      return { success: true };
    } catch (error) {
      return { 
        success: false,
        message: error.response?.data?.message || 'Logout failed' 
      };
    }
  }
};

