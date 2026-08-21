const jwt = require('jsonwebtoken');

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token;
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Not an admin' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = { protectAdmin };
