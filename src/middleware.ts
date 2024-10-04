import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({req: request})
  const url = request.nextUrl
  // Check if the user is not authenticated and is trying to access protected pages
    if (!token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/login-in') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/') 
    )){
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!token &&  url.pathname.startsWith('/dashboard')){ 
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
            '/login-in',
            '/',
            '/sign-in',
            '/verify/:path*',
            '/dashboard/:path*',
  ]
}