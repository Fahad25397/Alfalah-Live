import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Admin from '@/lib/models/Admin';

export async function POST(request) {
  try {
    const isAdmin = await verifyAuth();
    if (!isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 });
    }

    await connectDB();
    
    // We know the email is alfalahhoney2@gmail.com since there's only one admin
    const email = 'alfalahhoney2@gmail.com';
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json({ message: 'Admin account not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 401 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ message: 'Server error during password change' }, { status: 500 });
  }
}
