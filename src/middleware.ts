import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the pathname of the request (e.g. /, /protected)
    const path = request.nextUrl.pathname

    if (path.startsWith('/_next') ||
        path.includes('.') ||
        path.startsWith('/api')) {
        return NextResponse.next()
    }

    // Get the token from cookies
    const isAuthenticated = request.cookies.has('token')

    // Define public paths that don't require authentication
    const isPublicPath = path === '/signin'

    // If the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath) {
        // Redirect to the signin page
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // If the user is authenticated and trying to access signin page
    if (isAuthenticated && isPublicPath) {
        // Redirect to the home page
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Continue with the request
    return NextResponse.next()
}

// Configure which routes to run the middleware on
export const config = {
    matcher: [
        // Match all routes except static files and api
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
        // Include your specific routes
        '/simpeg/:path*',
        '/sim-aduan/:path*',
        '/sim-asset/:path*',
        '/sim-arsip/:path*',
        '/si-nomor/:path*',
        '/sim-keu/:path*',
        '/service-desk/:path*',
        '/jdih/:path*',
        '/signin'
    ]
}
