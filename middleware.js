import { NextResponse } from 'next/server';

export async function middleware(req) {
  const session = req.cookies.get('session')?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname === '/login' || pathname === '/register') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
