import axios from 'axios';

/**
 * Robust API Client with Automatic Fallback
 * - Tries custom VITE_API_URL first (if defined).
 * - If VITE_API_URL is outdated/returns 404 or Network Error, automatically falls back to same-domain relative '/api/...'
 */
export const apiRequest = async (config) => {
  const customBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
  const fullUrl = customBase ? `${customBase}${path}` : path;

  try {
    const token = localStorage.getItem('admin_token');
    const headers = { ...config.headers };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return await axios({
      ...config,
      url: fullUrl,
      withCredentials: true,
      headers
    });
  } catch (err) {
    if (customBase && (err.response?.status === 404 || !err.response)) {
      console.warn(`[API Fallback] ${config.method?.toUpperCase() || 'GET'} to ${fullUrl} failed (${err.response?.status || 'Network Error'}). Retrying on same-domain path: ${path}`);
      return await axios({
        ...config,
        url: path,
        withCredentials: true,
      });
    }
    throw err;
  }
};

export const api = {
  get: (url, config = {}) => apiRequest({ ...config, method: 'get', url }),
  post: (url, data, config = {}) => apiRequest({ ...config, method: 'post', url, data }),
  put: (url, data, config = {}) => apiRequest({ ...config, method: 'put', url, data }),
  delete: (url, config = {}) => apiRequest({ ...config, method: 'delete', url }),
};

export default api;
