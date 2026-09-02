const connectDB = require('../../backend/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectDB();

    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const adminHash = process.env.ADMIN_PASSWORD_HASH || '$2b$10$XKEpnsx.q5OWcw/Oh7wByuekIOuUHv7PIB/I6poMaOUGpGis820Yq';

    const isMatch = await bcrypt.compare(password, adminHash);

    if (!isMatch) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret_for_dev',
      { expiresIn: '24h' }
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};
