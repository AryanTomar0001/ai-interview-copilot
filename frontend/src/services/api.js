import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_MAIN_API_URL
});

const AUTH_API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Token interceptor
AUTH_API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// APIs
export const checkAttemptLimit = async () => {
  const response = await AUTH_API.get('/limit/check-attempt');
  return response.data;
};

export const checkResumeLimit = async () => {
  const response = await AUTH_API.get('/limit/check-resume');
  return response.data;
};

export const incrementResumeUpload = async () => {
  const response = await AUTH_API.post('/limit/increment-resume');
  return response.data;
};

export const saveAttempt = async (attemptData) => {
  const response = await AUTH_API.post('/attempt/save', attemptData);
  return response.data;
};

export const getUserHistory = async () => {
  const response = await AUTH_API.get('/user/history');
  return response.data;
};

export const getUserStats = async () => {
  const response = await AUTH_API.get('/user/stats');
  return response.data;
};

export { AUTH_API };
export default API;