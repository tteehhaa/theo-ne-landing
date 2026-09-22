/**
 * First-party visit analytics.
 *
 * This runs alongside the GA4 tag rather than replacing it. GA4 reports
 * aggregates, which cannot answer "did this particular visitor read the
 * founder section, and for how long" — the question the admin dashboard at
 * /admin/ exists to answer. These events are the raw material for it.
 *
 * It collects as little as it can: no cookies, a visit id that lives in
 * sessionStorage and dies with the tab, and no IP address (the server stores
 * only a salted hash of it).
 */

const ENDPOINT = '/api/collect';

/**
 * Per-browser opt-out. The operator's own visits would otherwise sit in their
 * own dashboard and drown the handful of real ones.
 *
 * The admin page writes this same key — it is served from the same origin, so
 * toggling it there silences the landing page too. Change it in one place and
 * the other stops matching, so `public/admin/app.js` names it as well.
 */
const OPT_OUT_KEY = 'theone.optout';

/** How much of a section must be on screen before it counts as being read. */
const VISIBLE_RATIO = 0.4;

/** Below this, a section was scrolled past rather than looked at. */
const MIN_DWELL_MS = 800;

/** The landing page's blocks. Each key is the name the dashboard shows. */
const SECTIONS: Record<string, string> = {
  hero: '.hero',
  work: '#work',
  founder: '#founder',
  faq: '#faq',
  contact: '#contact',
};

type TrackedEvent = {
  event: 'pageview' | 'section' | 'click' | 'exit';
  path: string;
  lang: string;
  referrer?: string;
  target?: string;
  dwellMs?: number;
  at: number;
};

let queue: TrackedEvent[] = [];
let sessionId = '';

/** Per section: time accumulated so far, and when the current sighting began. */
const dwell = new Map<string, { total: number; since: number | null }>();

function makeSessionId(): string {
  const key = 'theone.sid';
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(key, fresh);
    return fresh;
  } catch {
    // Storage is blocked (Safari private mode and friends). A value that lives
    // only as long as this page still groups the visit's events together.
    return crypto.randomUUID();
  }
}

function push(event: TrackedEvent['event'], extra: Partial<TrackedEvent> = {}): void {
  queue.push({
    event,
    path: location.pathname,
    lang: document.documentElement.lang || 'ko',
    at: Date.now(),
    ...extra,
  });
  if (queue.length >= 20) flush();
}

function flush(): void {
  if (!queue.length) return;

  const now = Date.now();
  const body = JSON.stringify({
    sessionId,
    // Elapsed time rather than a timestamp, so a visitor's misconfigured clock
    // cannot scatter their events across the calendar.
    events: queue.map(({ at, ...rest }) => ({ ...rest, ago: Math.max(0, now - at) })),
  });
  queue = [];

  // sendBeacon still delivers while the page is being torn down, which is
  // exactly when the last and most complete batch is sent.
  try {
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon?.(ENDPOINT, blob)) return;
  } catch {
    /* Fall through to fetch below. */
  }

  void fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    /* A failed measurement must never be visible to the visitor. */
  });
}

/**
 * Closes out the time every on-screen section has accrued and queues it.
 * `closeOpen` is false when the page may still come back (a tab switch), so
 * the timer keeps running from now instead of stopping.
 */
function settleSections(closeOpen: boolean): void {
  const now = Date.now();
  for (const [id, state] of dwell) {
    if (state.since !== null) {
      state.total += now - state.since;
      state.since = closeOpen ? null : now;
    }
    if (state.total >= MIN_DWELL_MS) {
      push('section', { target: id, dwellMs: Math.round(state.total) });
      state.total = 0;
    }
  }
}

function watchSections(): void {
  const targets = new Map<Element, string>();
  for (const [id, selector] of Object.entries(SECTIONS)) {
    const el = document.querySelector(selector);
    if (el) targets.set(el, id);
  }
  if (!targets.size || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      const now = Date.now();
      for (const entry of entries) {
        const id = targets.get(entry.target);
        if (!id) continue;

        const state = dwell.get(id) ?? { total: 0, since: null };
        dwell.set(id, state);

        const visible = entry.isIntersecting && entry.intersectionRatio >= VISIBLE_RATIO;
        if (visible && state.since === null) {
          state.since = now;
        } else if (!visible && state.since !== null) {
          state.total += now - state.since;
          state.since = null;
        }
      }
    },
    // A section taller than the viewport can never reach 40%, so the low
    // thresholds are there to keep the callback firing as it scrolls through.
    { threshold: [0, 0.1, VISIBLE_RATIO, 0.75] }
  );

  for (const el of targets.keys()) observer.observe(el);
}

function optedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    // Storage blocked. Opting out is impossible to read, so measure as usual.
    return false;
  }
}

/**
 * `?no-track` silences this browser for good, `?track` undoes it. The admin
 * page has a switch for the same thing; this is the way in on a device where
 * signing in first is more trouble than it is worth.
 *
 * Returns true when the visit should not be measured.
 */
function applyOptOutFromUrl(): boolean {
  const params = new URLSearchParams(location.search);
  try {
    if (params.has('no-track')) {
      localStorage.setItem(OPT_OUT_KEY, '1');
      return true;
    }
    if (params.has('track')) localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // Nothing to do: without storage the choice cannot be remembered anyway.
    return params.has('no-track');
  }
  return false;
}

/** Which contact route a visitor actually took is the clearest conversion signal. */
function clickLabel(href: string): string {
  if (href.startsWith('mailto:')) return 'email';
  if (href.startsWith('tel:')) return 'phone';
  if (/linkedin\.com/.test(href)) return 'linkedin';
  if (/trops\.kr/.test(href)) return 'trops';
  if (/teheranro-ai\.com/.test(href)) return 'teheranro-ai';
  if (href.startsWith('/')) return `internal:${href}`;
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return 'other';
  }
}

function watchClicks(): void {
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element | null)?.closest?.('a');
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute('href') ?? '';
      if (!href || href.startsWith('#')) return;

      push('click', { target: clickLabel(href) });
      // A click often navigates away, so this batch goes out immediately.
      flush();
    },
    { capture: true }
  );
}

/**
 * Starts collecting. Local development traffic is skipped so it never reaches
 * the production numbers; the prerenderer has no `window` and skips naturally.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return;
  if (navigator.webdriver) return;
  if (applyOptOutFromUrl() || optedOut()) return;

  sessionId = makeSessionId();

  push('pageview', { referrer: document.referrer || undefined });
  // Sent right away: a visitor who leaves after three seconds still counts.
  flush();

  watchSections();
  watchClicks();

  // Hiding the tab is the practical end of a visit. pagehide can be followed by
  // a bfcache restore, so only that path stops the section timers for good.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      settleSections(false);
      push('exit');
      flush();
    }
  });
  window.addEventListener('pagehide', () => {
    settleSections(true);
    flush();
  });
}
