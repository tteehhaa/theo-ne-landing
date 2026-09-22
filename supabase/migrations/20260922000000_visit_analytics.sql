-- Visitor analytics schema for theo-ne.com.
--
-- Apply it either way — every statement is idempotent, so running it twice
-- changes nothing:
--
--   * `supabase db push --linked` (needs the CLI linked to the project), or
--   * paste this whole file into Supabase > SQL Editor and press Run.
--
-- The project it belongs to is `kimusrivsubyghfhrwng` (pp_a, ap-northeast-2),
-- which hosts other applications as well. Every object below therefore carries
-- a `theone_` prefix: a bare `page_views` would be a plausible name for another
-- app's table, and `create table if not exists` would then silently leave that
-- table in place and let inserts fail against the wrong columns.
--
-- Two design decisions worth stating up front:
--
--   * Raw IP addresses are never stored. Only a salted HMAC lands in `ip_hash`,
--     which is enough to rate-limit logins and tell visitors apart, but cannot
--     be turned back into an address if the database ever leaks.
--
--   * RLS is enabled with no policies at all. That combination denies every
--     read and write made with the anon or authenticated key, and lets through
--     only the service_role key, which bypasses RLS and lives exclusively in
--     the serverless functions.

-- ---------------------------------------------------------------------------
-- Visit events
-- ---------------------------------------------------------------------------
create table if not exists public.theone_page_views (
  id           bigint generated always as identity primary key,
  occurred_at  timestamptz not null default now(),

  -- Groups one visit (one browser tab), minted in sessionStorage.
  session_id   text        not null,

  -- 'pageview' | 'section' | 'click' | 'exit'
  event        text        not null,

  path         text        not null,
  lang         text,
  referrer     text,

  -- For 'section', the section id (hero/work/founder/faq/contact).
  -- For 'click', the click label (email/linkedin/trops/...).
  target       text,

  -- How long a section actually stayed on screen. This is the evidence behind
  -- "which information did this visitor read".
  dwell_ms     integer,

  -- Location, straight from the headers Vercel's edge attaches to the request.
  country      text,
  region       text,
  city         text,
  timezone     text,

  device       text,   -- 'mobile' | 'tablet' | 'desktop'
  browser      text,
  os           text,

  ip_hash      text,
  is_bot       boolean not null default false
);

-- Every dashboard query starts with "the last N days, excluding bots", so the
-- indexes lead with those columns.
create index if not exists theone_page_views_occurred_at_idx on public.theone_page_views (occurred_at desc);
create index if not exists theone_page_views_session_idx     on public.theone_page_views (session_id, occurred_at);
create index if not exists theone_page_views_live_idx        on public.theone_page_views (is_bot, occurred_at desc);

alter table public.theone_page_views enable row level security;

-- ---------------------------------------------------------------------------
-- Login attempts, for brute-force throttling
-- ---------------------------------------------------------------------------
-- Serverless instances each hold their own memory, so an in-process counter
-- cannot enforce a limit. Recording attempts here gives every instance the
-- same counter to read.
create table if not exists public.theone_admin_login_attempts (
  id           bigint generated always as identity primary key,
  attempted_at timestamptz not null default now(),
  ip_hash      text        not null,
  username     text,
  ok           boolean     not null
);

create index if not exists theone_admin_login_attempts_idx
  on public.theone_admin_login_attempts (ip_hash, attempted_at desc);

alter table public.theone_admin_login_attempts enable row level security;

-- ---------------------------------------------------------------------------
-- Retention
-- ---------------------------------------------------------------------------
-- Keeps the table inside the free tier's storage. api/collect.js calls this on
-- roughly one request in a hundred, which is often enough that no cron job or
-- scheduled extension is needed.
create or replace function public.theone_prune_analytics(retain_days integer default 400)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.theone_page_views
   where occurred_at < now() - (retain_days || ' days')::interval;
  delete from public.theone_admin_login_attempts
   where attempted_at < now() - interval '30 days';
$$;
