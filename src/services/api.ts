import axios from 'axios';

const baseURL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const initData = async () => {
  try {
    const response = await api.get('/auth/init-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching init data:', error);
    throw error;
  }
};

export const sendMessage = async (message: string) => {
  try {
    const response = await api.post('/chat', { message });

    // Check if response has data
    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Chat API Error:', error);

    // Extract error message
    let errorMessage = 'Failed to send message';
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = 'Unauthorized. Please login again.';
      } else if (status === 400) {
        errorMessage = data.message || 'Invalid request';
      } else if (status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else {
        errorMessage = data.message || 'Server error occurred';
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'No response from server';
    } else {
      // Other errors
      errorMessage = error.message || 'Failed to send message';
    }

    throw new Error(errorMessage);
  }
};

export default api;
