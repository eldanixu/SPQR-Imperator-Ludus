import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/v1',
});

// Request Interceptor: add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spqr-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('spqr-token');
      localStorage.removeItem('spqr-username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
