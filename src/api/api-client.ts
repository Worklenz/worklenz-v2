import axios, { AxiosError } from 'axios';

import alertService from '@/services/alerts/alertService';

const getCsrfToken = (): string | null => {
  const match = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('XSRF-TOKEN='));
  
  if (!match) {
    return null;
  }
  return decodeURIComponent(match.split('=')[1]);
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = getCsrfToken();
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    } else {
      console.warn('No CSRF token found');
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor with notification handling based on done flag
apiClient.interceptors.response.use(
  response => {
     // Handle 302 redirect
     if (response.status === 302) {
      const redirectUrl = response.headers.location;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return response;
      }
    }
    
    if (response.data) {
      const { title, message, auth_error, done } = response.data;

      if (message && message.charAt(0) !== '$') {
         if (done) {
          alertService.success(title || '', message);
        } else {
          alertService.error(title || '', message);
        }
      } else if (auth_error) {
        alertService.error(title || 'Authentication Error', auth_error);
      }
    }
    return response;
  },
  async (error:AxiosError) => {
    const { message, code, name} = error || {};

    const errorMessage = message || 'An unexpected error occurred';
    const errorTitle = 'Error';

    if (error.code !== 'ERR_NETWORK') {
      alertService.error(errorTitle, errorMessage);
    }
  
    // Development logging
    if (import.meta.env.VITE_APP_ENV === 'development') {
      console.error('API Error:', {
        code,
        name,
        message,
        headers: error.config?.headers,
        cookies: document.cookie,
      });
    }
  
    return Promise.reject(error);
  }
);

export default apiClient;
