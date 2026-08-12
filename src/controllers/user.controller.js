import User from '../models/user.model.js';

export const setTheme = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { theme } = req.body;
    
    if (!theme || !['Light', 'Violet', 'Dark'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme' });
    }
    
    const user = await User.findByIdAndUpdate(userId, { theme }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      success: true,
      message: 'Theme updated', 
      data: { theme: user.theme } 
    });
  } catch (err) {
    next(err);
  }
};
