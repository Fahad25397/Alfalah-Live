const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

let storage;
const useCloudinary = (process.env.CLOUDINARY_CLOUD_NAME || 'lm6l4tpm') && (process.env.CLOUDINARY_API_KEY || '577294165855747') && (process.env.CLOUDINARY_API_SECRET || 'lCjTdCyNFukz4dPVz7RNUfWYQGM');

if (useCloudinary) {
  // Use Cloudinary
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'alfalah-products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'],
      transformation: [{ width: 800, crop: 'limit', quality: 'auto:good' }]
    }
  });
} else {
  // Use Local Disk
  const uploadDir = path.join(__dirname, '../uploads');
  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.warn("Could not create uploads directory:", err.message);
  }
  
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      // Handle pasted files that might not have an originalname
      const ext = file.originalname ? path.extname(file.originalname) : '.jpg';
      cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
    }
  });
}
const multerInstance = multer({ storage });
// Wrapper middleware to catch upload crashes cleanly
const uploadMiddleware = (req, res, next) => {
  const uploadSingle = multerInstance.single('imageFile');
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('File Upload Crash:', err);
      return res.status(500).json({ 
        message: 'Image upload failed. If on Vercel, check Cloudinary credentials.',
        error: err.message || err.toString()
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;
