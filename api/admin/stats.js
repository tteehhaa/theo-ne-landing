import { supabase } from '../_lib/supabase.js';
import { requireAdmin } from '../_lib/auth.js';
import { aggregate, TZ } from '../_lib/aggregate.js';

/**
 * The single query endpoint behind the dashboard.
 *
 * It reads the window's raw events once and hands them to `aggregate`, which
 * folds every breakdown in one pass. Giving each breakdown its own SQL would
 * mean a dozen round trips; at landing page volume, one read and one pass is
 * faster and leaves the schema with nothing but the events table in it.
 */

/** Ceiling on how many events one request will examine, newest first. */
const MAX_ROWS = 30_000;
const PAGE = 1000;

const COLUMNS =
  'occurred_at,session_id,event,path,lang,referrer,target,dwell_ms,country,region,city,timezone,device,browser,os,is_bot';

/**
 * Bot traffic is counted on its own, because when bots are filtered out of the
 * main query there are no bot rows left to count — and "0 crawler events" is a
 * misleading thing for the dashboard to claim about a site built for crawlers.
 */
async function countBotEvents(db, fromIso) {
  const { count, error } = await db
    .from('theone_page_views')
    .select('id', { count: 'exact', head: true })
    .gte('occurred_at', fromIso)
    .eq('is_bot', true);
  if (error) throw error;
  return count ?? 0;
}

async function fetchRows(db, fromIso, includeBots) {
  const rows = [];
  // PostgREST caps a single response at 1000 rows, so the window is paged
  // through rather than asked for all at once.
  for (let offset = 0; offset < MAX_ROWS; offset += PAGE) {
    let query = db
      .from('theone_page_views')
      .select(COLUMNS)
      .gte('occurred_at', fromIso)
      .order('occurred_at', { ascending: false })
      .range(offset, offset + PAGE - 1);

    if (!includeBots) query = query.eq('is_bot', false);

    const { data, error } = await query;
    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return rows;
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 1), 365);
  const includeBots = req.query.bots === 'include';
  const from = new Date(Date.now() - days * 86_400_000);

  const fromIso = from.toISOString();
  let rows;
  let botEvents;
  try {
    const db = supabase();
    [rows, botEvents] = await Promise.all([
      fetchRows(db, fromIso, includeBots),
      countBotEvents(db, fromIso),
    ]);
  } catch (err) {
    console.error('[stats] query failed', err?.message ?? err);
    return res.status(500).json({ error: 'query_failed' });
  }

  const ownHost = String(req.headers.host ?? '')
    .split(':')[0]
    .replace(/^www\./, '');

  const folded = aggregate(rows, { days, ownHost });

  return res.status(200).json({
    range: { days, from: fromIso, to: new Date().toISOString(), timezone: TZ },
    truncated: rows.length >= MAX_ROWS,
    includeBots,
    ...folded,
    totals: { ...folded.totals, botEvents },
  });
}
