// utils/config.js
// Try window._env_ first, then process.env, fallback to localhost
export const API_BASE_URL = 
  (window._env_ && window._env_.REACT_APP_API_URL) || 
  (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 
  'http://localhost:5000';