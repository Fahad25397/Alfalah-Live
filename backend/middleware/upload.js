const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Use Cloudinary if configured
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'alfalah-products',
      transformation: [{ width: 600, height: 600, crop: 'limit', quality: 'auto:good' }]
    }
  });
} else {
  // Fallback to local storage
  const uploadDir = path.join(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    console.warn("Failed to create uploads directory. If on Vercel, this is expected due to read-only filesystem:", err.message);
  }
  
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname))
    }
  });
}

// Configure multer without file size limits
const upload = multer({ 
  storage: storage
});

module.exports = upload;
