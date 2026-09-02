import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const verifyAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev');
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
};
