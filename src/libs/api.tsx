import axios from 'axios';
import Cookies from 'js-cookie';

// 1.  Define the environment variable name
const API_URL_ENV_NAME = 'API_URL';

// 2.  Helper function to safely get environment variables
function getEnvVariable(name: string, defaultValue?: string): string {
  if (typeof window !== 'undefined') {
    // Client-side:  Use process.env (for Next.js, etc.)
    return process.env.NEXT_PUBLIC_API_URL || defaultValue || ''; // Changed to NEXT_PUBLIC_
  } else {
    // Server-side:  Access directly
    return process.env[name] || defaultValue || '';
  }
}

// 3.  Get the base URL from the environment
// const baseURL = getEnvVariable(API_URL_ENV_NAME, 'http://localhost:3000');
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 4.  Create the Axios instance
const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache' // Disable HTTP cache, we'll handle our own
    },
    withCredentials: true, // Important for cookies with sameSite: 'none'
});

/*
 !! interseptors  (Typo corrected: interceptors)
  - set header globally, so we not to need set header in every request page
 */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Use js-cookie instead of manual cookie parsing for better compatibility
    const token = Cookies.get('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    } else {
      // Debug: Log if token is not found
      console.warn('⚠️ Token cookie not found in request interceptor');
    }
  }
  return config;
});

export default api;
