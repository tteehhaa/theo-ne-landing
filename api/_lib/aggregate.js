/**
 * Folds raw visit events into everything the dashboard shows.
 *
 * Kept apart from the endpoint, and free of any I/O, so the arithmetic that
 * the numbers on screen depend on can be exercised directly against fixed
 * input rather than only against whatever production happens to contain.
 */

/** Every date and hour bucket is in the operator's timezone, not the visitor's. */
export const TZ = 'Asia/Seoul';

const dayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false });

/** Sorts a breakdown and keeps the leading entries. */
function top(map, n = 12) {
  return [...map.entries()]
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => b.views - a.views || b.visitors - a.visitors)
    .slice(0, n);
}

/** `views` counts events; `visitors` counts the distinct sessions behind them. */
function bump(map, key, sessionId) {
  const k = key ?? null;
  let entry = map.get(k);
  if (!entry) {
    entry = { views: 0, visitors: 0, _sessions: new Set() };
    map.set(k, entry);
  }
  entry.views += 1;
  if (sessionId && !entry._sessions.has(sessionId)) {
    entry._sessions.add(sessionId);
    entry.visitors += 1;
  }
}

/** The Set exists only to de-duplicate while folding; it must not be serialized. */
const strip = (rows) => rows.map(({ _sessions, ...rest }) => rest);

/**
 * Folds a referrer URL down to a hostname. Navigation within the site itself
 * is reported as direct traffic, since it says nothing about acquisition.
 * Returns null for "direct", which the dashboard words for the reader.
 */
export function referrerHost(referrer, ownHost) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    return ownHost && host === ownHost ? null : host;
  } catch {
    return String(referrer).slice(0, 60);
  }
}

/**
 * @param rows  page_views rows, newest first.
 * @param opts  `days` sets the length of the trend series, `ownHost` the
 *              hostname that counts as self-referral, `now` pins the clock for
 *              tests.
 */
export function aggregate(rows, { days, ownHost, now = Date.now() } = {}) {
  const daily = new Map();
  const hourly = new Map();
  const countries = new Map();
  const cities = new Map();
  const sections = new Map();
  const clicks = new Map();
  const referrers = new Map();
  const devices = new Map();
  const browsers = new Map();
  const oses = new Map();
  const langs = new Map();
  const paths = new Map();
  const sessions = new Map();

  let pageviews = 0;
  let botEvents = 0;

  for (const r of rows) {
    const at = new Date(r.occurred_at);
    const sid = r.session_id;

    if (r.is_bot) botEvents += 1;

    bump(daily, dayFmt.format(at), sid);
    bump(hourly, hourFmt.format(at), sid);
    bump(countries, r.country, sid);
    bump(cities, r.city ? `${r.city}${r.country ? ` · ${r.country}` : ''}` : null, sid);
    bump(devices, r.device, sid);
    bump(browsers, r.browser, sid);
    bump(oses, r.os, sid);
    bump(langs, r.lang, sid);

    if (r.event === 'pageview') {
      pageviews += 1;
      bump(paths, r.path, sid);
      bump(referrers, referrerHost(r.referrer, ownHost), sid);
    }

    if (r.event === 'section' && r.target) {
      bump(sections, r.target, sid);
      const s = sections.get(r.target);
      s.dwellMs = (s.dwellMs ?? 0) + (r.dwell_ms ?? 0);
    }

    if (r.event === 'click' && r.target) bump(clicks, r.target, sid);

    // The per-session timeline: one row per visit, answering "who came when,
    // and what did they actually read".
    let s = sessions.get(sid);
    if (!s) {
      s = {
        sessionId: sid,
        startedAt: r.occurred_at,
        endedAt: r.occurred_at,
        city: r.city,
        region: r.region,
        country: r.country,
        timezone: r.timezone,
        device: r.device,
        browser: r.browser,
        os: r.os,
        lang: r.lang,
        isBot: r.is_bot,
        referrer: referrerHost(r.referrer, ownHost),
        events: 0,
        _paths: new Set(),
        _sections: new Map(),
        _clicks: new Set(),
      };
      sessions.set(sid, s);
    }
    s.events += 1;
    if (r.occurred_at < s.startedAt) s.startedAt = r.occurred_at;
    if (r.occurred_at > s.endedAt) s.endedAt = r.occurred_at;
    // Rows arrive newest first, so the last referrer written is the earliest
    // one in the session — the one that actually sent the visitor.
    if (r.referrer) s.referrer = referrerHost(r.referrer, ownHost);
    s._paths.add(r.path);
    if (r.event === 'section' && r.target) {
      s._sections.set(r.target, (s._sections.get(r.target) ?? 0) + (r.dwell_ms ?? 0));
    }
    if (r.event === 'click' && r.target) s._clicks.add(r.target);
  }

  const sessionList = [...sessions.values()]
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, 200)
    .map(({ _paths, _sections, _clicks, ...s }) => ({
      ...s,
      durationSec: Math.max(0, Math.round((new Date(s.endedAt) - new Date(s.startedAt)) / 1000)),
      paths: [..._paths],
      clicks: [..._clicks],
      sections: [..._sections.entries()]
        .map(([id, ms]) => ({ id, seconds: Math.round(ms / 1000) }))
        .sort((a, b) => b.seconds - a.seconds),
    }));

  // Days with no traffic still need a point, or the trend closes the gap and
  // makes a quiet stretch look like a busy one.
  const series = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const key = dayFmt.format(new Date(now - i * 86_400_000));
    const entry = daily.get(key);
    series.push({ date: key, views: entry?.views ?? 0, visitors: entry?.visitors ?? 0 });
  }

  const hours = Array.from({ length: 24 }, (_, h) => {
    const key = String(h).padStart(2, '0');
    return { hour: key, views: hourly.get(key)?.views ?? 0 };
  });

  return {
    totals: {
      events: rows.length,
      pageviews,
      visitors: sessions.size,
      botEvents,
      avgSessionSec: sessionList.length
        ? Math.round(sessionList.reduce((sum, s) => sum + s.durationSec, 0) / sessionList.length)
        : 0,
    },
    series,
    hours,
    countries: strip(top(countries)),
    cities: strip(top(cities)),
    sections: strip(top(sections, 20)).map((s) => ({
      ...s,
      avgDwellSec: s.views ? Math.round((s.dwellMs ?? 0) / s.views / 1000) : 0,
    })),
    clicks: strip(top(clicks)),
    referrers: strip(top(referrers)),
    devices: strip(top(devices, 5)),
    browsers: strip(top(browsers, 8)),
    os: strip(top(oses, 8)),
    langs: strip(top(langs, 5)),
    paths: strip(top(paths, 10)),
    sessions: sessionList,
  };
}
