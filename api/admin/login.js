import { supabase } from '../_lib/supabase.js';
import {
  hashIp,
  safeEqual,
  verifyPassword,
  signSession,
  sessionCookie,
  SESSION_TTL_MS,
} from '../_lib/auth.js';
import { clientIp } from '../_lib/request.js';

/** One address gets this many failures in this window before it is locked out. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const username = String(body?.username ?? '');
  const password = String(body?.password ?? '');
  const ip_hash = hashIp(clientIp(req));
  const db = supabase();

  // The counter lives in the database because each serverless instance has its
  // own memory, and an in-process tally would reset itself away.
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count } = await db
    .from('theone_admin_login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ip_hash)
    .eq('ok', false)
    .gte('attempted_at', since);

  if ((count ?? 0) >= MAX_FAILURES) {
    return res.status(429).json({ error: 'too_many_attempts', retryAfterMinutes: 15 });
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !storedHash) {
    console.error('[login] ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not set.');
    return res.status(500).json({ error: 'not_configured' });
  }

  // The password is verified even when the username is already wrong: skipping
  // the scrypt work would make a wrong username answer measurably faster and
  // so reveal which half of the guess was correct.
  const userOk = safeEqual(username, expectedUser);
  const passOk = verifyPassword(password, storedHash);
  const ok = userOk && passOk;

  await db.from('theone_admin_login_attempts').insert({ ip_hash, username: username.slice(0, 64), ok });

  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

  res.setHeader('Set-Cookie', sessionCookie(signSession(expectedUser), SESSION_TTL_MS / 1000));
  return res.status(200).json({ ok: true, expiresIn: SESSION_TTL_MS });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
