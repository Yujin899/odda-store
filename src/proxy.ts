import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const proxy = NextAuth(authConfig).auth;
export default proxy;

// Proxy config
export const config = {
  matcher: [
    '/((?!api/warmup|api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
