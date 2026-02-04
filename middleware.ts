import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';
import { query } from './lib/db';

const PROTECTED_PATHS = ['/admin', '/app/api/events', '/app/api/instructors', '/app/api/applications'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin paths and protected API endpoints
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) return NextResponse.redirect(new URL('/admin/login', req.url));

    // verify user exists in DB
    try {
      const res = await query('SELECT id FROM users WHERE id = $1 LIMIT 1', [payload.sub]);
      if (res.rows.length === 0) return NextResponse.redirect(new URL('/admin/login', req.url));
    } catch (err) {
      console.error('Middleware DB check failed', err);
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/api/:path*']
};
