import { sessionCookie } from '../_lib/auth.js';

export default function handler(req, res) {
  // Returning the same cookie name with Max-Age=0 makes the browser drop it.
  res.setHeader('Set-Cookie', sessionCookie('', 0));
  return res.status(200).json({ ok: true });
}
