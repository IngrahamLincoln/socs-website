import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/landing',
  '/about',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/lessons', // Allow fetching lesson list without auth
])

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  '/lesson/(.*)', // Individual lesson pages
  '/api/track(.*)', // Metrics tracking endpoints
  '/dashboard(.*)', // Analytics dashboard
])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return
  }

  // Protect specific routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}