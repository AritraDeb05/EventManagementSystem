import db from '../config/db.js';

const User = db.User;

// Get all users (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID (Admin or self)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Allow user to view their own profile, or admin to view any profile
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You can only view your own profile.' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user by ID (Admin or self)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, ...updateData } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent non-admin users from changing other users' profiles or their own role
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
    }

    // Prevent non-admin users from changing their role or other users' roles
    if (req.user.role !== 'admin' && updateData.role && updateData.role !== user.role) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to change roles.' });
    }

    // Handle password update if provided
    if (password) {
      user.password = password; // The hook in the model will hash this
    }

    // Apply other updates
    Object.assign(user, updateData);
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.passwordHash;

    res.status(200).json({ message: 'User updated successfully.', user: userResponse });
  } catch (error) {
    next(error);
  }
};

// Delete user by ID (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent an admin from deleting themselves (optional, but good practice)
    if (req.user.id === user.id) {
      return res.status(403).json({ message: 'Forbidden: An admin cannot delete their own account.' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
