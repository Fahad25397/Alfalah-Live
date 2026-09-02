import axios from 'axios';

/**
 * Robust API Client for Next.js
 */
export const apiRequest = async (config) => {
  // Use relative path for all requests since API is on same domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
  const fullUrl = `${baseUrl}${path}`;

  let token = null;
  if (typeof window !== 'undefined') {
    // Client side token retrieval if needed, though Next.js uses httpOnly cookies 
    // for admin_token now, so we don't strictly need to pass it in headers.
    token = localStorage.getItem('admin_token');
  }
  
  const headers = { ...config.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return await axios({
    ...config,
    url: fullUrl,
    headers,
    withCredentials: true, // Send cookies for admin routes
  });
};

export const getImageUrl = (imagePath, requestedWidth = null) => {
  if (!imagePath) return '';

  let sourceUrl = imagePath;

  if (!imagePath.startsWith('http') && !imagePath.startsWith('data:') && !imagePath.startsWith('blob:')) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    sourceUrl = `${baseUrl}${imagePath}`;
  }

  if (sourceUrl.includes('localhost') || sourceUrl.startsWith('data:') || sourceUrl.startsWith('blob:')) {
    return sourceUrl;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (cloudName) {
    let transformations = 'f_auto,q_auto';
    if (requestedWidth) {
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
