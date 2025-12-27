import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware({
  localeDetection: false,
  ...routing,
});

// Protected routes that require authentication
const protectedRoutes = [
  "/account",
  "/checkout",
  "/orders"
];

// Routes that should redirect authenticated users away (e.g., login, signup)
const authPreventedRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/otp"
];

// Check if a route is protected
function isProtectedRoute(pathname) {
  return protectedRoutes.some(route => 
    pathname.includes(route) || 
    pathname.includes("/account/") ||
    pathname.includes("/orders/")
  );
}

// Check if a route should prevent authenticated users
function isAuthPreventedRoute(pathname) {
  return authPreventedRoutes.some(route => pathname.includes(route));
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Handle internationalization first
  const intlResponse = intlMiddleware(request);
  
  // Extract locale from the request for API calls
  const pathnameLocale = pathname.split('/')[1];
  const isValidLocale = ['az', 'en', 'ru'].includes(pathnameLocale);
  const currentLocale = isValidLocale ? pathnameLocale : 'az';
  
  // Get the access token from cookies
  const accessToken = request.cookies.get("access_token");
  const isAuthenticated = !!accessToken;
  
  // Get guest identifier from cookies
  const guestIdentifier = request.cookies.get("guest_identifier");
  
  // Check if the route is protected
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      // Redirect to login page if no token found
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Check if the route should prevent authenticated users
  if (isAuthPreventedRoute(pathname)) {
    if (isAuthenticated) {
      // Redirect authenticated users to account page
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }
  
  // Handle guest identifier for non-authenticated users
  if (!isAuthenticated && !guestIdentifier) {
    try {
      // Generate guest identifier via API call
      const apiUrl = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_HOST}/api/app/guests/generate-identifier`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': process.env.NEXT_PUBLIC_API_TOKEN || '',
          'Accept-Language': currentLocale
        },
        body: JSON.stringify({
          device_type: 'web'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newIdentifier = data.identifier;
        
        // Create response with guest identifier cookie
        const responseWithCookie = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        
        // Set the guest identifier cookie
        responseWithCookie.cookies.set('guest_identifier', newIdentifier, {
          maxAge: 365 * 24 * 60 * 60, // 1 year
          secure: process.env.NODE_ENV === 'production',
          httpOnly: false,
          sameSite: 'lax',
          path: '/'
        });
        
        return responseWithCookie;
      }
    } catch (error) {
      // If guest identifier generation fails, continue without it
      console.error('Failed to generate guest identifier:', error);
    }
  }
  
  // If no redirects needed, continue with internationalization
  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|public|.*\\..*|\\.well-known).*)"],
};

