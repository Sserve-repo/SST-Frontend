import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from './actions/auth'
// import type { NextRequest } from "next/server";

// 1. Specify protected and public routes
const protectedRoutes = ['/checkout', '/booking']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    if (!isAuthenticated && isProtectedRoute) {
        const absoluteURL = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    // 5. Redirect to /dashboard if the user is authenticated
    //   if (
    //     isPublicRoute &&
    //     session?.userId &&
    //     !req.nextUrl.pathname.startsWith('/dashboard')
    //   ) {
    //     return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    //   }

    return NextResponse.next()
}



// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}