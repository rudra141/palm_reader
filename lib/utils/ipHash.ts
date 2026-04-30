// One-way hash of the request IP — used as an anonymous rate-limit + spend
// key. Never log raw IPs; always salt + hash. Salt comes from env (or a
// dev default) so the same IP across server restarts maps to the same key.

import { createHash } from 'node:crypto';

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? 'praxa-dev-salt-change-me';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

export function getIpFromHeaders(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() ?? '0.0.0.0';
  return headers.get('x-real-ip') ?? '0.0.0.0';
}
