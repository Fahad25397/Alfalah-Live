const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alfalah-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'limit', quality: 'auto:good' }]
  }
});

// Configure multer with file size limits (e.g. 50KB)
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 } 
});

module.exports = upload;
