import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const User = db.User;

export const isAuthenticated = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (id, role) to the request
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const hasRole = (roles) => (req, res, next) => {
  // roles can be a single string or an array of strings
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: 'Forbidden: User role not found' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: `Forbidden: Requires one of the following roles: ${allowedRoles.join(', ')}` });
  }
  next();
};
