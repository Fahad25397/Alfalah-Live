const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protectAdmin } = require('../middleware/auth');

// Note: In production, the ADMIN_PASSWORD_HASH should be generated once and stored in .env
// You can generate a hash by running: node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Fallback hash for 'admin123' if env variable is missing on Vercel
    const adminHash = process.env.ADMIN_PASSWORD_HASH || '$2b$10$XKEpnsx.q5OWcw/Oh7wByuekIOuUHv7PIB/I6poMaOUGpGis820Yq';
    if (!adminHash) {
      console.error('ADMIN_PASSWORD_HASH not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const isMatch = await bcrypt.compare(password, adminHash);
    
    if (!isMatch) {
      // Add a slight delay to mitigate timing attacks/brute force
      await new Promise(resolve => setTimeout(resolve, 500));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret_for_dev',
      { expiresIn: '24h' }
    );

    // Set HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjust sameSite based on cross-origin needs
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.cookie('admin_token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

// GET /api/admin/me (Check auth status)
router.get('/me', protectAdmin, (req, res) => {
  res.json({ authenticated: true, role: 'admin' });
});

module.exports = router;
