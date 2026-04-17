// middleware/errorHandler.js
// Global error handler - catches anything not handled in controllers

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
