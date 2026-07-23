import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // withCredentials: true,
});

// Attach JW T token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor for session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/login')) {
      // Token expired or invalid — clear session and force login
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const logoutUser = () => API.get('/auth/logout');
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);


// Candidates
export const getCandidates = (params) => API.get('/candidates', { params });
export const getCandidate = (id) => API.get(`/candidates/${id}`);
export const createCandidate = (data) => API.post('/candidates', data);
export const updateCandidate = (id, data) => API.put(`/candidates/${id}`, data);
export const deleteCandidate = (id) => API.delete(`/candidates/${id}`);
export const exportCandidates = () => API.get('/candidates/export', { responseType: 'blob' });

// Training
export const getAllTraining = () => API.get('/training');
export const getTrainingByCandidate = (id) => API.get(`/training/candidate/${id}`);
export const createTraining = (data) => API.post('/training', data);
export const updateTraining = (id, data) => API.put(`/training/${id}`, data);

// Mocks
export const getAllMocks = () => API.get('/mocks');
export const getMocksByCandidate = (id) => API.get(`/mocks/candidate/${id}`);
export const createMock = (data) => API.post('/mocks', data);
export const updateMock = (id, data) => API.put(`/mocks/${id}`, data);

// Marketing
export const getAllMarketing = () => API.get('/marketing');
export const getMarketingByCandidate = (id) => API.get(`/marketing/candidate/${id}`);
export const createMarketing = (data) => API.post('/marketing', data);
export const updateMarketing = (id, data) => API.put(`/marketing/${id}`, data);

// Vendors
export const getAllVendors = (params) => API.get('/vendors', { params });
export const createVendor = (data) => API.post('/vendors', data);
export const updateVendor = (id, data) => API.put(`/vendors/${id}`, data);
export const deleteVendor = (id) => API.delete(`/vendors/${id}`);

// Submissions
export const getAllSubmissions = (params) => API.get('/submissions', { params });
export const createSubmission = (data) => API.post('/submissions', data);
export const updateSubmission = (id, data) => API.put(`/submissions/${id}`, data);
export const getSubmissionsByCandidate = (id) => API.get(`/submissions/candidate/${id}`);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');

export default API;
