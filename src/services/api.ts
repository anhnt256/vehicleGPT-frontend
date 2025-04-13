import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api';

let authToken: string | null = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Add interceptor to ensure auth header is always present
api.interceptors.request.use(
  (config) => {
    console.log('authToken', authToken);

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    console.log('Request config:', {
      url: config.url,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

export const initData = async () => {
  try {
    console.log('Calling initData with token:', authToken);
    const response = await api.get('/auth/init-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching init data:', error);
    throw error;
  }
};

export default api;
