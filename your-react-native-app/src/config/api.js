export const API_BASE_URL = __DEV__ 
  ? 'https://your-ngrok-url.ngrok.io'  // Replace with your actual ngrok URL
  : 'https://your-production-url.com';

// Example API client setup
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}); 