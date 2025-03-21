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
    UPDATE: '/jobs/:id',
    DELETE: '/jobs/:id',
    APPLY: '/jobs/apply',
    //   '/jobs?id=:id', // for everyone get job deatils
    //   '/jobs?applied=true' // for users and recruiters get applied jobs



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

  APPLICATIONS: {
    BASE: '/applications',
    UPDATE_STATUS: '/applications/status'
  }
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

  getJobs: async (filters) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.JOBS.LIST}`, {
        params: filters,
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch jobs'
      };
    }
  },

  applyJob: async (jobId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.JOBS.APPLY}`,
        { jobId },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || {
        success: false,
        message: error.message || 'Application failed'
      };
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

    deleteJob: async (jobId) => {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}${API_ENDPOINTS.JOBS.DELETE.replace(':id', jobId)}`,
          { withCredentials: true }
        );
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete job');
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
  },

  getJob: async (jobId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.JOBS.LIST}`, {
        params: { id: jobId },
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch job');
    }
  },

  getApplications: async (jobId, status) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.APPLICATIONS.BASE}`, {
        params: { jobId, status },
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}${API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS}`,
        { applicationId, status },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Status update failed');
    }
  },

  
};
