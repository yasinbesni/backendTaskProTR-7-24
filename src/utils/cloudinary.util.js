import ApiError from '../helpers/ApiError.js';
import { configureCloudinary } from '../config/cloudinary.js';

const supportedImageDataUrl =
  /^data:image\/(?:jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/;

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

    if (!supportedImageDataUrl.test(base64Image)) {
      throw ApiError.BadRequest(
        'Avatar must be a valid JPG, PNG or WEBP image.'
      );
    }

    const cloudinaryClient = configureCloudinary();

    const result = await cloudinaryClient.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 512, height: 512, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('Cloudinary avatar upload error:', {
      message: error.message,
      httpCode: error.http_code,
    });
    throw ApiError.InternalServerError(
      'Avatar upload failed. Please try another image.'
    );
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

    const cloudinaryClient = configureCloudinary();
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const uploadIndex = pathParts.indexOf('upload');

    if (uploadIndex === -1) {
      return false;
    }

    const afterUpload = pathParts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts = afterUpload.slice(
      versionIndex === -1 ? 0 : versionIndex + 1
    );
    const publicId = decodeURIComponent(publicIdParts.join('/')).replace(
      /\.[^/.]+$/,
      ''
    );

    if (!publicId) {
      return false;
    }

    const result = await cloudinaryClient.uploader.destroy(publicId, {
      resource_type: 'image',
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

export default { uploadToCloudinary, deleteFromCloudinary };
