import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

const User = db.User;

export const register = async (req, res, next) => {
  const { username, email, password, firstName, lastName, role } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password (handled by model hook, just pass plain password temporarily)
    const newUser = await User.create({
      username,
      email,
      password: password, // The hook will hash this to passwordHash
      firstName,
      lastName,
      role: role || 'attendee', // Default role
    });

    // Do not return passwordHash
    const userResponse = newUser.toJSON();
    delete userResponse.passwordHash;

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in a secure HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Logged in successfully',
      accessToken,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error('Refresh token error:', error.message);
    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    return res.status(403).json({ message: 'Invalid or expired refresh token.' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully.' });
};
