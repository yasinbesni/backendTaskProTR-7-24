import cloudinary from 'cloudinary';
import ApiError from '../helpers/ApiError.js';

/**
 * Configure Cloudinary when it is actually needed.
 *
 * The project has used two environment-variable naming conventions. Supporting
 * both keeps existing deployments working while matching .env.example.
 */
export const configureCloudinary = () => {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
  const apiSecret =
    process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new ApiError(
      503,
      'Avatar upload service is not configured. Check Cloudinary environment variables.'
    );
  }

  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary.v2;
};

export default configureCloudinary;
