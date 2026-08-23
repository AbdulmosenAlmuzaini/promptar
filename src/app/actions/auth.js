'use server';

import { cookies } from 'next/headers';
import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret-key-change-in-production-32bytes');
const COOKIE_NAME = 'admin_session';

export async function loginAdminAction(email, password) {
  try {
    if (!email || !password) {
      return { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' };
    }

    let user = null;

    if (process.env.DATABASE_URL) {
      const users = await db.select().from(schema.admins).where(eq(schema.admins.email, email)).limit(1);
      if (users.length > 0) {
        user = users[0];
      }
    }

    // Demo / Initial Fallback credential check if DB not seeded yet
    if (!user && email === 'admin@prompt.local' && password === 'Admin123') {
      const token = await new SignJWT({ email, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return { success: true };
    }

    if (!user) {
      return { success: false, error: 'بيانات الدخول غير صحيحة' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'كلمة المرور غير صحيحة' };
    }

    const token = await new SignJWT({ userId: user.id, email: user.email, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
  } catch (err) {
    console.error('Login action error:', err);
    return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
  }
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}

export async function verifyAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload && payload.role === 'admin';
  } catch (e) {
    return false;
  }
}
