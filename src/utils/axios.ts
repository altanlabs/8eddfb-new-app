import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.altan.ai/galaxia/hook/0iZpTg',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default instance;