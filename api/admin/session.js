import { parseCookies, verifySession, SESSION_COOKIE } from '../_lib/auth.js';

/** Lets the dashboard decide, on load, whether to show the sign-in form. */
export default function handler(req, res) {
  const session = verifySession(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
  if (!session) return res.status(401).json({ authenticated: false });
  return res.status(200).json({ authenticated: true, username: session.u, expiresAt: session.exp });
}
