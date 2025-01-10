import axios from 'axios';

const apiAiChatClient = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL, // Backend base URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 600000, // Set a timeout for requests
});

export default apiAiChatClient;