const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protectAdmin } = require('../middleware/auth');
const Admin = require('../models/Admin');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email !== 'alfalahhoney2@gmail.com') {
      return res.status(401).json({ message: 'Unauthorized email' });
    }

    let admin = await Admin.findOne({ email });

    // Seed the database if this is the first login
    if (!admin) {
      const defaultHash = await bcrypt.hash('admin123', 10);
      admin = await Admin.create({ email, password: defaultHash });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      // Add a slight delay to mitigate timing attacks/brute force
      await new Promise(resolve => setTimeout(resolve, 500));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'admin', email: admin.email },
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

// POST /api/admin/change-password
router.post('/change-password', protectAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const email = 'alfalahhoney2@gmail.com';
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error during password change' });
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

