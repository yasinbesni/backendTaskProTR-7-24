import cloudinary from 'cloudinary';
import ApiError from '../helpers/ApiError.js';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image string
 * @param {string} folder - Folder name in Cloudinary (e.g., 'avatars', 'backgrounds')
 * @returns {Promise<string>} - Cloudinary image URL
 */
export const uploadToCloudinary = async (base64Image, folder = 'taskpro') => {
  try {
    if (!base64Image) {
      throw ApiError.BadRequest('No image provided');
    }

    const result = await cloudinary.v2.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw ApiError.InternalServerError('Failed to upload image');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {Promise<boolean>}
 */
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return false;
    }

    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const publicIdWithExtension = urlParts.slice(-2).join('/'); // folder/filename.ext
    const publicId = publicIdWithExtension.split('.')[0]; // remove extension

    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export default { uploadToCloudinary, deleteFromCloudinary };
