// Server-side PostHog wrapper.
//
// Initializes once per Node process. No-ops cleanly when env vars aren't set
// (preview deploys, local dev without an analytics key) so callers never
// branch on configuration.
//
// We only import `posthog-node` here, never the browser bundle, so there's no
// risk of pulling client code into a server route.
//
// Distinct id rules:
//   - Authed user → use the internal user uuid (stable across sessions/devices).
//   - Anonymous   → use the `palm_anon_session` cookie value (UUID).
//
// When an anonymous user signs in, callers should `aliasAnon()` to merge the
// two histories in PostHog.

import { PostHog } from 'posthog-node';

let client: PostHog | null = null;
let warned = false;

function getClient(): PostHog | null {
  if (client) return client;

  const key = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    if (!warned && process.env.NODE_ENV === 'production') {
      console.warn('[analytics] PostHog key not set — events are dropped.');
      warned = true;
    }
    return null;
  }

  client = new PostHog(key, {
    host: process.env.POSTHOG_HOST ?? process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    flushAt: 1, // serverless: flush each event immediately
    flushInterval: 0,
  });
  return client;
}

export interface CaptureInput {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}

/**
 * Fire a server-side event. Returns immediately — failures are swallowed and
 * never block the request. Safe to await; the no-op path is sub-millisecond.
 */
export async function capture({ distinctId, event, properties }: CaptureInput): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    c.capture({ distinctId, event, properties });
    // posthog-node batches; force-flush on serverless so we don't lose events
    // when the lambda freezes. flushAt=1 above already triggers, but the
    // explicit flush guards against the rare batched case.
    await c.flush();
  } catch (err) {
    console.warn('[analytics] capture failed:', (err as Error).message);
  }
}

/**
 * Tell PostHog that two distinct ids belong to the same user. Call right after
 * a sign-in or anon→authed claim so the funnel stitches together.
 */
export async function aliasAnon(input: {
  authedDistinctId: string;
  anonDistinctId: string;
}): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    c.alias({ distinctId: input.authedDistinctId, alias: input.anonDistinctId });
    await c.flush();
  } catch (err) {
    console.warn('[analytics] alias failed:', (err as Error).message);
  }
}

/**
 * Identify a user with traits (email, signup date, etc.) — call at first
 * authed page load. Idempotent.
 */
export async function identify(input: {
  distinctId: string;
  properties?: Record<string, unknown>;
}): Promise<void> {
  const c = getClient();
  if (!c) return;
  try {
    c.identify({ distinctId: input.distinctId, properties: input.properties });
    await c.flush();
  } catch (err) {
    console.warn('[analytics] identify failed:', (err as Error).message);
  }
}
