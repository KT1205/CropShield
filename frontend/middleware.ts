import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    if (
      req.nextUrl.pathname.startsWith('/home') || 
      req.nextUrl.pathname.startsWith('/history') || 
      req.nextUrl.pathname.startsWith('/about')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  console.log("Middleware triggered: ", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home", "/history", "/about"],
};
