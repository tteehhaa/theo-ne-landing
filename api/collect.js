import { supabase } from './_lib/supabase.js';
import { hashIp } from './_lib/auth.js';
import { clientIp, geoFrom, isBot, parseUa, clamp } from './_lib/request.js';

/**
 * Visit-event intake.
 *
 * The browser batches events and ships them with `navigator.sendBeacon`.
 * Location, device and bot status are filled in here from the request headers
 * rather than trusted from the payload, so a forged request cannot claim to be
 * a desktop visitor in Seoul.
 */

const ALLOWED_EVENTS = new Set(['pageview', 'section', 'click', 'exit']);
const MAX_EVENTS_PER_REQUEST = 40;

/** sendBeacon posts a Blob, so a pre-parsed `req.body` is not guaranteed. */
async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const body = await readJson(req);
  const sessionId = clamp(body?.sessionId, 64);
  const events = Array.isArray(body?.events) ? body.events.slice(0, MAX_EVENTS_PER_REQUEST) : [];
  if (!sessionId || events.length === 0) {
    return res.status(400).json({ error: 'bad_request' });
  }

  const ua = req.headers['user-agent'] ?? '';
  const { device, browser, os } = parseUa(ua);
  const geo = geoFrom(req);
  const ip_hash = hashIp(clientIp(req));
  const bot = isBot(ua);
  const now = Date.now();

  const rows = events
    .filter((e) => ALLOWED_EVENTS.has(e?.event))
    .map((e) => ({
      // A visitor's clock can be wrong by hours, so the client sends "how long
      // ago" and the server reads it back off its own clock. Negative values
      // and anything past a day are clamped away.
      occurred_at: new Date(now - Math.min(Math.max(Number(e.ago) || 0, 0), 86_400_000)).toISOString(),
      session_id: sessionId,
      event: e.event,
      path: clamp(e.path, 300) ?? '/',
      lang: clamp(e.lang, 8),
      referrer: clamp(e.referrer, 500),
      target: clamp(e.target, 120),
      dwell_ms: Number.isFinite(Number(e.dwellMs))
        ? Math.min(Math.max(Math.round(Number(e.dwellMs)), 0), 86_400_000)
        : null,
      ...geo,
      device,
      browser,
      os,
      ip_hash,
      is_bot: bot,
    }));

  if (!rows.length) return res.status(400).json({ error: 'no_valid_events' });

  try {
    const { error } = await supabase().from('theone_page_views').insert(rows);
    if (error) throw error;
  } catch (err) {
    console.error('[collect] insert failed', err?.message ?? err);
    return res.status(500).json({ error: 'insert_failed' });
  }

  // Keeps retention without a cron job. Once in a hundred requests is plenty.
  if (Math.random() < 0.01) {
    supabase()
      .rpc('theone_prune_analytics', { retain_days: 400 })
      .then(({ error }) => error && console.error('[collect] prune failed', error.message));
  }

  return res.status(204).end();
}
