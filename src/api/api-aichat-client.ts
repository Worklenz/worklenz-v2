import axios from 'axios';


const apiAiChatClient = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL, // Backend base URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 600000, // Set a timeout for requests
});

// Add a request interceptor to include the Authorization header
apiAiChatClient.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_CHAT_TOKEN; // Retrieve the token from localStorage or cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
       // Add the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiAiChatClient;