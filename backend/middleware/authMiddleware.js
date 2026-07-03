'use strict';

const jwt = require('jsonwebtoken');

async function protect(req, res, next) {
  try {
    let token;

    console.log('Authorization header:', req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? token.substring(0, 20) + '...' : 'empty');

      if (!token || token === 'undefined' || token === '{{token}}') {
        return res.status(401).json({ message: 'No valid token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      const User  = require('../models/User');
      req.user    = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('User authenticated:', req.user.email);
      next();
    } else {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' });
    }

    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

module.exports = { protect };