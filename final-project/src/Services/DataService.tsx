import axios from 'axios';
import { BASE_URL } from '../constant';

// Types and Interfaces
interface LoginRequest {
  UserName: string;
  Password: string;
}

interface RegisterRequest {
  UserName: string;
  Password: string;
}

interface LoginResponse {
  Token: string;
}

interface RegisterResponse {
  result: boolean;
}

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error Handling
const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'Access denied.';
        case 404:
          return 'Resource not found.';
        case 409:
          return 'Username already exists. Please choose another.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `An error occurred. Please try again. Status: ${error.response.status}`;
      }
    } else if (error.request) {
      console.error('Request error:', error.request);
      return 'No response from server. Please check your connection.';
    }
  }
  console.error('Unexpected error:', error);
  return 'An unexpected error occurred.';
};

// Authentication Services
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('Login request with credentials:', credentials);
    try {
      const response = await api.post<LoginResponse>('User/Login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.Token) {
        console.log('Setting token in localStorage:', response.data.Token);
        localStorage.setItem('token', response.data.Token);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(handleApiError(error));
    }
  },

  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    console.log('Register request with data:', userData);
    try {
      const response = await api.post<RegisterResponse>('User/AddUser', userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(handleApiError(error));
    }
  },

  logout: () => {
    console.log('Logging out, removing token from localStorage');
    localStorage.removeItem('token');
  },

  getToken: () => {
    const token = localStorage.getItem('token');
    console.log('Getting token from localStorage:', token ? 'Token exists' : 'No token found');
    return token;
  },

  isAuthenticated: () => {
    const isAuth = !!localStorage.getItem('token');
    console.log('Checking authentication status:', isAuth);
    return isAuth;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request config:', config);
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(handleApiError(error));
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Received response:', response);
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log('Unauthorized response, logging out');
        authService.logout();
      }
    }
    return Promise.reject(handleApiError(error));
  }
);

export default api;