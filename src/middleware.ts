import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If user is signed in and the current path is / or /login or /signup,
    // redirect the user to /dashboard
    if (user && ['/login', '/signup', '/'].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not signed in and the current path is not / or /login or /signup,
    // redirect the user to /login
    if (!user && !['/login', '/signup', '/'].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return res;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 