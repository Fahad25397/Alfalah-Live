import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  return NextResponse.json({ message: 'Logged out successfully' });
}
