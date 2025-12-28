const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong on the server.';
  
    // Handle specific Sequelize errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Resource already exists.', errors: err.errors.map(e => e.message) });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Validation error.', errors: err.errors.map(e => e.message) });
    }
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Foreign key constraint failed.', errors: err.errors.map(e => e.message) });
    }
  
    res.status(statusCode).json({
      message: message,
      // In development, send stack trace for debugging
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
  
  export default errorHandler;
  