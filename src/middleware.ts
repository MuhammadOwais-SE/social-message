import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl
    if (token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/login-in') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/') ||
    ))
    { return

    }
    return NextResponse.redirect(new URL('/home', request.url))
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