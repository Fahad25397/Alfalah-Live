import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Admin from '@/lib/models/Admin';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    if (email !== 'alfalahhoney2@gmail.com') {
      return NextResponse.json({ message: 'Unauthorized email' }, { status: 401 });
    }

    let admin = await Admin.findOne({ email });

    // Seed the database if this is the first login
    if (!admin) {
      const defaultHash = '$2b$10$XKEpnsx.q5OWcw/Oh7wByuekIOuUHv7PIB/I6poMaOUGpGis820Yq';
      admin = await Admin.create({ email, password: defaultHash });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      // Add a slight delay to mitigate timing attacks/brute force
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { role: 'admin', email: admin.email },
      process.env.JWT_SECRET || 'fallback_secret_for_dev',
      { expiresIn: '24h' }
    );

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60,
      path: '/'
    });

    return NextResponse.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error during login' }, { status: 500 });
  }
}
