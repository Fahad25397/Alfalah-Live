import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  const isAdmin = await verifyAuth();
  if (isAdmin) {
    return NextResponse.json({ authenticated: true, role: 'admin' });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
