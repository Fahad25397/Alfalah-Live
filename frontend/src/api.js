import axios from 'axios';

/**
 * Robust API Client
 * - In development: calls http://localhost:5000 (local backend server)
 * - In production: uses same-origin relative paths (/api/...) since the
 *   Vercel serverless functions live on the same domain as the frontend.
 *   This avoids CORS entirely.
 */
export const apiRequest = async (config) => {
  // Use VITE_API_URL if explicitly set, otherwise localhost in dev, or same-origin in prod
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : import.meta.env.DEV
      ? 'http://localhost:5000'
      : ''; // empty string = same-origin relative path

  const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
  const fullUrl = `${baseUrl}${path}`;

  const token = localStorage.getItem('admin_token');
  const headers = { ...config.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return await axios({
    ...config,
    url: fullUrl,
    headers,
  });
};

export const getImageUrl = (imagePath, requestedWidth = null) => {
  if (!imagePath) return '';

  let sourceUrl = imagePath;

  if (!imagePath.startsWith('http') && !imagePath.startsWith('data:') && !imagePath.startsWith('blob:')) {
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
      : import.meta.env.DEV
        ? 'http://localhost:5000'
        : '';
    sourceUrl = `${baseUrl}${imagePath}`;
  }

  // If local dev or blob/data, don't use Cloudinary fetch
  if (sourceUrl.includes('localhost') || sourceUrl.startsWith('data:') || sourceUrl.startsWith('blob:')) {
    return sourceUrl;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (cloudName) {
    let transformations = 'f_auto,q_auto';
    
    if (requestedWidth) {
      // Bounded Responsive Steps (200px increments)
      const roundedWidth = Math.ceil(requestedWidth / 200) * 200;
      transformations += `,w_${roundedWidth}`;
    }
    
    return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformations}/${sourceUrl}`;
  }

  return sourceUrl;
};

export const api = {
  get: (url, config = {}) => apiRequest({ ...config, method: 'get', url }),
  post: (url, data, config = {}) => apiRequest({ ...config, method: 'post', url, data }),
  put: (url, data, config = {}) => apiRequest({ ...config, method: 'put', url, data }),
  delete: (url, config = {}) => apiRequest({ ...config, method: 'delete', url }),
};

export default api;

