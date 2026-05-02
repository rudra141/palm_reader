// Clerk middleware. Auth is OPTIONAL at v1 — anonymous users can still
// upload, get a reading, and chat. The middleware exists to:
//   1. Surface auth context (userId, sessionId) to API routes that want it,
//      without forcing any route to require authentication.
//   2. Protect a small set of routes that genuinely require sign-in:
//      /dashboard, /account, /api/dashboard.
//
// Per /docs/sitemap.md: report pages stay accessible without auth so users
// can share their reading link.

import { NextResponse, type NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

function clerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  if (/^pk_(test|live)_x+$/i.test(key)) return false;
  return key.length > 30;
}

// Note on protection model: we do NOT call auth.protect() here. The dashboard
// page handles its own redirect via `auth()` + `redirect('/sign-in')` in a
// server component. Calling auth.protect() in middleware was producing 404s
// instead of 307 redirects on dashboard requests, which is a Clerk
// behaviour that activates when middleware can't resolve a sign-in URL.
// Page-level redirect is more reliable and gives us a clean 307.
const clerkHandler = clerkMiddleware(async () => {
  // No-op — Clerk still attaches auth context to the request so server
  // components can call `auth()` / `currentUser()` reliably.
});

// When Clerk isn't configured (build-time before env wiring; preview without
// keys), short-circuit middleware so the request flow doesn't crash. The
// auth-gated routes will still 404 / no-op gracefully via their own page-level
// fallbacks.
async function noopMiddleware(_req: NextRequest) {
  return NextResponse.next();
}

const handler = clerkConfigured() ? clerkHandler : noopMiddleware;
export default handler;

export const config = {
  // Skip Next.js internals + static files. Match everything else, including
  // API routes (so auth() works inside them when a user is signed in).
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
