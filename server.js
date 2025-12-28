import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import db from './config/db.js';
import allRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    // In development, sync models. In production, use migrations.
    return db.sequelize.sync({ alter: true }); // `alter: true` attempts to make necessary changes to the database to match the models. Use with caution in production.
  })
  .then(() => {
    console.log('Database models synced.');
  })
  .catch(err => {
    console.error('Unable to connect to the database or sync models:', err);
    process.exit(1); // Exit process with failure
  });

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after a minute',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', allRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Event Management API is running!');
});

// Global Error Handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});
