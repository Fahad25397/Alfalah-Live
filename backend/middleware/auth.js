const jwt = require('jsonwebtoken');

const protectAdmin = async (req, res, next) => {
  try {
    let token = req.cookies.admin_token;
    
    // Fallback to Bearer token if cookie is blocked (e.g., cross-domain on Vercel)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
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
