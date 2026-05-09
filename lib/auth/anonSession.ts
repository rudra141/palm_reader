// Anonymous session cookie helpers.
//
// Tracks anonymous users across the upload → analyze → report flow so we can
// (a) re-attach the reading to a real user account once they sign in, and
// (b) gate /report/[id] to either the matching anon session or its owner.
//
// The cookie is httpOnly + lax + 90-day TTL. Value is a UUIDv4 minted on first
// upload; subsequent uploads from the same browser keep the same id.

import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export const ANON_SESSION_COOKIE = 'palm_anon_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

/** Read the anon session id from request cookies. Server components + route handlers. */
export async function readAnonSessionId(): Promise<string | null> {
  const c = await cookies();
  return c.get(ANON_SESSION_COOKIE)?.value ?? null;
}

/** Set or refresh the anon session cookie on a NextResponse. Route handlers only. */
export function setAnonSessionCookie(res: NextResponse, value: string): void {
  res.cookies.set(ANON_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });
}

/** Generate a fresh anon session id. */
export function newAnonSessionId(): string {
  return crypto.randomUUID();
}
