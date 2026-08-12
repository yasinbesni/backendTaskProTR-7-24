import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../helpers/ApiError.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.util.js';

const { JWT_SECRET, JWT_EXPIRES_IN = '30d' } = process.env;

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, theme } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'Email already in use');
    }

    // Create new user
    const user = new User({ name, email, password });

    // Set theme if provided and valid
    if (theme && ['Light', 'Violet', 'Dark'].includes(theme)) {
      user.theme = theme;
    }

    console.log(`[REGISTER DEBUG] Before save - password: ${user.password}`);
    await user.save();
    console.log(`[REGISTER DEBUG] After save - password (hashed): ${user.password?.substring(0, 10)}...`);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          theme: user.theme,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`[LOGIN DEBUG] User not found for email: ${email}`);
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    console.log(`[LOGIN DEBUG] Email: ${email}, Password match: ${isPasswordMatch}, Provided password: ${password}`);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          theme: user.theme,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/current
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          theme: user.theme,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password, avatar, theme } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new ApiError(400, 'Email already in use');
      }
      user.email = email;
    }

    // Update fields
    if (name) user.name = name;
    if (theme) user.theme = theme;
    
    // Handle avatar upload to Cloudinary
    if (avatar && avatar.startsWith('data:image')) {
      // Delete old avatar from Cloudinary if exists
      if (user.avatar && user.avatar.includes('cloudinary.com')) {
        await deleteFromCloudinary(user.avatar);
      }
      
      // Upload new avatar
      const cloudinaryUrl = await uploadToCloudinary(avatar, 'taskpro/avatars');
      user.avatar = cloudinaryUrl;
    } else if (avatar !== undefined) {
      user.avatar = avatar;
    }
    
    if (password) user.password = password; // Will be hashed by pre-save hook

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          theme: user.theme,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user theme
// @route   PUT /api/auth/theme
// @access  Private
const updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;

    if (!theme || !['Light', 'Violet', 'Dark'].includes(theme)) {
      throw new ApiError(400, 'Invalid theme. Valid values: Light, Violet, Dark');
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { theme },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      message: 'Theme updated',
      data: {
        user: {
          id: user._id,
          theme: user.theme,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // Since we're using JWT, logout is handled on the client side
    // This endpoint can be used for logging purposes or token blacklisting if needed
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, getCurrentUser, updateProfile, updateTheme, logout };
