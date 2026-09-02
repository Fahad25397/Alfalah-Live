import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'lm6l4tpm',
  api_key: process.env.CLOUDINARY_API_KEY || '577294165855747',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'lCjTdCyNFukz4dPVz7RNUfWYQGM'
});

export const uploadImage = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'alfalah-products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'],
        transformation: [{ width: 800, crop: 'limit', quality: 'auto:good' }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;
