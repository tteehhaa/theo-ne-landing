import crypto from 'node:crypto';

/** Name of the admin session cookie. */
export const SESSION_COOKIE = 'theone_admin';

/** Deliberately short. When it lapses, the operator signs in again. */
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not set.');
  return value;
}

/**
 * Derives a purpose-specific key from the one configured secret. Signing
 * sessions and salting IPs with the same bytes would mean a leak on either
 * side breaks both, so each use gets its own label.
 */
function derive(label) {
  return crypto.createHmac('sha256', secret()).update(label).digest();
}

/** The anonymous stand-in stored instead of a raw IP: stable, but not reversible. */
export function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHmac('sha256', derive('ip-salt')).update(ip).digest('hex').slice(0, 32);
}

/**
 * Checks a password against a `scrypt$<saltHex>$<hashHex>` value. Both the
 * length check and the byte comparison stay on timing-safe paths.
 */
export function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return false;
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, 'hex');
  let actual;
  try {
    actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length, {
      N: 16384,
      r: 8,
      p: 1,
    });
  } catch {
    return false;
  }
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

/** Compares values of differing length without leaking that length through timing. */
export function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a ?? '')).digest();
  const hb = crypto.createHash('sha256').update(String(b ?? '')).digest();
  return crypto.timingSafeEqual(ha, hb);
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');

/**
 * A signed session token. The expiry travels inside the token and is sealed
 * with an HMAC, so no server-side session store is needed.
 */
export function signSession(username) {
  const payload = b64url(JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS }));
  const mac = crypto.createHmac('sha256', derive('session')).update(payload).digest('base64url');
  return `${payload}.${mac}`;
}

export function verifySession(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, mac] = token.split('.');

  const expected = crypto.createHmac('sha256', derive('session')).update(payload).digest('base64url');
  const a = Buffer.from(mac ?? '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function parseCookies(header) {
  const out = {};
  for (const part of String(header ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function sessionCookie(value, maxAgeSeconds) {
  return [
    `${SESSION_COOKIE}=${value}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    // Nothing ever links into the admin page from elsewhere, so the strictest
    // value costs nothing.
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ].join('; ');
}

/**
 * Admin guard. Returns the session on success; otherwise answers 401 and
 * returns null so the caller can simply bail out.
 */
export function requireAdmin(req, res) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  const session = verifySession(token);
  if (!session) {
    res.status(401).json({ error: 'unauthorized' });
    return null;
  }
  return session;
}
