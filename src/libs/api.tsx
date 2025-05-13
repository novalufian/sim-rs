import axios from 'axios';

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
const baseURL = getEnvVariable(API_URL_ENV_NAME, 'http://localhost:3000');

// 4.  Create the Axios instance
const api = axios.create({
  baseURL: baseURL,
});

/*
 !! interseptors  (Typo corrected: interceptors)
  - set header globally, so we not to need set header in every request page
 */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getCookie('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function getCookie(name: string): string | undefined {
  if (typeof window === 'undefined') {
        return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export default api;
