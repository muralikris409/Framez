import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getToken } from './app/actions/cookieHandler';
export async function middleware(req: NextRequest) {
  const token = await getToken("token");
  console.log("middleware",token)
  const protectedRoutes = ['/dashboard', '/profile', '/home','/'];

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token) { 
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/','/home'],
};
