import jwt from 'jsonwebtoken';

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateAccessToken = (user) => {
  return generateToken(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || '15m'
  );
};

export const generateRefreshToken = (user) => {
  return generateToken(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  );
};
