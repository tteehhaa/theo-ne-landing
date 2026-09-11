/**
 * Turns the client-rendered SPA into static HTML at build time.
 *
 * AI search crawlers (GPTBot / OAI-SearchBot, ClaudeBot, PerplexityBot,
 * Google-Extended, Bingbot) do not execute JavaScript, so without this step
 * they only ever see `<div id="root"></div>`. Here every language gets a fully
 * rendered document plus a complete head and a JSON-LD graph.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  LANGS,
  DEFAULT_LANG,
  META,
  ORIGIN,
  OG_IMAGE,
  ogImagePathFor,
  GA_MEASUREMENT_ID,
  TAX_ID,
  LINKS,
  VERIFICATION,
  pathFor,
  urlFor,
} from './site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const locales = Object.fromEntries(
  LANGS.map((lang) => [lang, readJson(`src/i18n/locales/${lang}.json`)])
);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON-LD is embedded in HTML, so `<` must not be able to close the script. */
const jsonLd = (obj) =>
  JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

function buildGraph(lang) {
  const L = locales[lang];
  const M = META[lang];
  const pageUrl = urlFor(lang);
  const ogImage = `${ORIGIN}${ogImagePathFor(lang)}`;
  const orgId = `${ORIGIN}/#org`;
  const founderId = `${ORIGIN}/#founder`;
  const tropsId = `${ORIGIN}/#trops`;
  const siteId = `${ORIGIN}/#website`;

  const organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: M.orgName,
    alternateName: M.orgAlternateName,
    url: `${ORIGIN}/`,
    description: M.orgDescription,
    email: L.contact.email,
    foundingDate: '2026',
    logo: { '@type': 'ImageObject', url: ogImage },
    image: ogImage,
    taxID: TAX_ID,
    address: {
      '@type': 'PostalAddress',
      streetAddress: M.streetAddress,
      addressLocality: M.addressLocality,
      addressRegion: M.addressRegion,
      addressCountry: 'KR',
    },
    brand: {
      '@type': 'Brand',
      name: M.brandName,
      alternateName: M.brandAlternateName,
      url: LINKS.teheranroai,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: M.offerCatalogName,
      itemListElement: L.work.support.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item, provider: { '@id': orgId } },
      })),
    },
    contactPoint: { '@type': 'ContactPoint', email: L.contact.email },
    founder: { '@id': founderId },
  };

  const founder = {
    '@type': 'Person',
    '@id': founderId,
    name: L.founder.name,
    alternateName: M.founderAlternateName,
    jobTitle: M.founderJobTitle,
    worksFor: { '@id': orgId },
    sameAs: [LINKS.linkedin],
    award: L.founder.award,
  };

  const trops = {
    '@type': 'SoftwareApplication',
    '@id': tropsId,
    name: 'TROPS',
    url: LINKS.trops,
    publisher: { '@id': orgId },
  };

  const website = {
    '@type': 'WebSite',
    '@id': siteId,
    url: ORIGIN,
    name: M.siteName,
    description: M.description,
    publisher: { '@id': orgId },
    inLanguage: LANGS,
  };

  // The page is both a WebPage and the FAQPage that carries the Q&A pairs —
  // one node per URL keeps the graph unambiguous for validators.
  const webpage = {
    '@type': ['WebPage', 'FAQPage'],
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: M.title,
    description: M.description,
    inLanguage: lang,
    isPartOf: { '@id': siteId },
    about: { '@id': orgId },
    mentions: [{ '@id': tropsId }, { '@id': founderId }],
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImage },
    mainEntity: L.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return { '@context': 'https://schema.org', '@graph': [organization, founder, trops, website, webpage] };
}

function buildHead(lang) {
  const M = META[lang];
  const pageUrl = urlFor(lang);
  const ogImage = `${ORIGIN}${ogImagePathFor(lang)}`;
  const other = LANGS.filter((l) => l !== lang);
  const tag = (s) => `    ${s}`;

  return [
    // Google Analytics 4, first in the managed block so it sits as high in the
    // head as anything the prerenderer controls.
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>`,
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');</script>`,
    `<title>${esc(M.title)}</title>`,
    `<meta name="description" content="${esc(M.description)}" />`,
    // Let engines quote the page at full length and show a large preview.
    `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`,
    // Search-console ownership, one tag per registered token. Both consoles
    // re-check periodically, so every token has to survive every deploy — not
    // just the first one, and not just the newest property.
    ...VERIFICATION.google.map(
      (t) => `<meta name="google-site-verification" content="${esc(t)}" />`
    ),
    ...VERIFICATION.naver.map(
      (t) => `<meta name="naver-site-verification" content="${esc(t)}" />`
    ),
    `<meta name="author" content="${esc(M.siteName)}" />`,
    `<link rel="canonical" href="${pageUrl}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LANG)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(M.siteName)}" />`,
    `<meta property="og:title" content="${esc(M.title)}" />`,
    `<meta property="og:description" content="${esc(M.description)}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:locale" content="${M.locale}" />`,
    ...other.map((l) => `<meta property="og:locale:alternate" content="${META[l].locale}" />`),
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:secure_url" content="${ogImage}" />`,
    `<meta property="og:image:type" content="${OG_IMAGE.type}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(M.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(M.title)}" />`,
    `<meta name="twitter:description" content="${esc(M.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<meta name="twitter:image:alt" content="${esc(M.ogImageAlt)}" />`,
    `<meta name="theme-color" content="#FFFFFF" />`,
    `<script type="application/ld+json">${jsonLd(buildGraph(lang))}</script>`,
  ]
    .map(tag)
    .join('\n');
}

/**
 * llms.txt — a plain-Markdown brief for AI agents that fetch the site directly
 * (llmstxt.org convention). Generated from the same locale files as the page,
 * so the two can never drift apart.
 */
function buildLlmsTxt() {
  const E = locales.en;
  const K = locales.ko;
  const M = META.en;

  const lines = [
    '# THÉONÉ Inc. ((주)테오네)',
    '',
    `> ${M.description}`,
    '',
    '## Key facts',
    '',
    `* **Legal name:** ${E.footer.legalName} / ${K.footer.legalName}`,
    '* **Founded:** 2026, Seoul, Republic of Korea',
    `* **CEO:** ${E.founder.name} (${K.founder.name})`,
    `* **Business registration number (Republic of Korea):** ${TAX_ID}`,
    `* **Address:** ${E.footer.address}`,
    `* **Email:** ${E.contact.email}`,
    `* **Website:** ${urlFor('ko')} (Korean), ${urlFor('en')} (English)`,
    '',
    '## What the company does',
    '',
    'Two axes.',
    '',
    `### 1. ${E.work.support.name}`,
    '',
    ...E.work.support.items.map((i) => `* ${i}`),
    '',
    `### 2. ${E.work.software.name}`,
    '',
    `Released under the brand **Teheranro AI Studio** (테헤란로 AI 스튜디오), ${LINKS.teheranroai} — the software brand of THÉONÉ Inc. THÉONÉ Inc. is the party to all contracts and payments.`,
    '',
    `* TROPS — ${LINKS.trops}`,
    '* Otherwise',
    '* Bar Route',
    '',
    E.work.bridgeLabel,
    '',
    '## What the company does not do',
    '',
    'Legal advice, legal review of contracts, disputes and litigation, and debt collection are outside what THÉONÉ Inc. does.',
    '',
    '## Founder',
    '',
    `${E.founder.name} (${K.founder.name}), ${E.founder.role}.`,
    '',
    ...E.founder.items.map((i) => `* ${i}`),
    '',
    `LinkedIn: ${LINKS.linkedin}`,
    '',
    '## Frequently asked questions',
    '',
    ...E.faq.items.flatMap((item) => [`### ${item.q}`, '', item.a, '']),
    '## Pages',
    '',
    `* [THÉONÉ Inc. (English)](${urlFor('en')})`,
    `* [(주)테오네 (한국어)](${urlFor('ko')})`,
    `* [TROPS](${LINKS.trops})`,
    `* [Teheranro AI Studio](${LINKS.teheranroai})`,
    '',
  ];

  return lines.join('\n');
}

function buildSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = LANGS.map((lang) => {
    const alts = LANGS.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l)}" />`
    ).join('\n');
    return [
      '  <url>',
      `    <loc>${urlFor(lang)}</loc>`,
      alts,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LANG)}" />`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      `    <priority>${lang === DEFAULT_LANG ? '1.0' : '0.9'}</priority>`,
      '  </url>',
    ].join('\n');
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

// ---- run ----

const templatePath = path.join(dist, 'index.html');
if (!fs.existsSync(templatePath)) {
  throw new Error('dist/index.html not found — run `vite build` before prerendering.');
}
const template = fs.readFileSync(templatePath, 'utf8');

// Google owns this property through a DNS TXT record on the apex domain, so no
// google meta tag is expected and its absence is not worth warning about.
// GOOGLE_SITE_VERIFICATION stays wired up for a future URL-prefix property.
if (VERIFICATION.naver.length === 0) {
  console.warn('  ! NAVER_SITE_VERIFICATION is unset — no naver site-verification tag will be emitted.');
} else {
  console.log(`  naver site-verification: ${VERIFICATION.naver.length} token(s)`);
}

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

for (const lang of LANGS) {
  const appHtml = render(lang);

  let html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/[ \t]*<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/, () => buildHead(lang))
    .replace('<!--ssr-outlet-->', () => appHtml);

  if (html.includes('<!--ssr-outlet-->') || html.includes('seo-head-start')) {
    throw new Error(`prerender placeholders left unreplaced for "${lang}"`);
  }

  const outPath =
    lang === DEFAULT_LANG ? path.join(dist, 'index.html') : path.join(dist, lang, 'index.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);

  const textLen = appHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
  console.log(
    `  prerendered ${pathFor(lang).padEnd(6)} -> ${path.relative(root, outPath)}  (${textLen} chars of crawlable text)`
  );
}

fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap());
console.log('  wrote dist/sitemap.xml');

fs.writeFileSync(path.join(dist, 'llms.txt'), buildLlmsTxt());
console.log('  wrote dist/llms.txt');
