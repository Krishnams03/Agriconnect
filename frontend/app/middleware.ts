// middleware.ts
import { NextResponse } from 'next/server';
import { isAuthenticated } from './utils/auth';

export function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Protect routes for logged-in users only
  if (!isAuthenticated() && url.pathname !== '/sign-up' && !url.pathname.startsWith('/api/')) {
    // If not authenticated, redirect to the sign-up page
    return NextResponse.redirect(new URL('/sign-up', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/features/*',
    '/disease-detection',
    '/plant-disease-detection',
    '/growth-factors',
    '/marketplace',
  ],
};
