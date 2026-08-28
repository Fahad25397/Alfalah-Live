const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'lm6l4tpm',
  api_key: process.env.CLOUDINARY_API_KEY || '577294165855747',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'lCjTdCyNFukz4dPVz7RNUfWYQGM'
});

module.exports = cloudinary;
