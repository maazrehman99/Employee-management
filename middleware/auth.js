// Authentication middleware to verify JWT tokens for protected routes
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');  

// `authMiddleware`: a middleware function for Express to authenticate users via JWT
// Attaches decoded user info to `req.user` if the token is valid
const authMiddleware = async (req, res, next) => {
  // Extracts token from Authorization header (format: "Bearer <token>")
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {  // Proceed if a token is present
    try {
      // Verify token using JWT_SECRET; attach decoded payload to `req.user`
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Log the error if verification fails and reset `req.user` to null
      console.error('JWT Verification failed:', err.message);
      req.user = null;
    }
  }
  // Call `next` to continue to the next middleware or route handler
  next();
};


module.exports = authMiddleware;
