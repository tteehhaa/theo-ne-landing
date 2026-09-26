/**
 * AI search readiness audit.
 *
 * Scope, stated plainly: this measures everything about the site that governs
 * whether an AI answer engine CAN read, understand and cite it. It does not and
 * cannot measure whether ChatGPT/Gemini/Grok/Claude already do cite it, because
 * that depends on each engine's crawl and index schedule, which takes days to
 * weeks after a change ships and is not queryable from here.
 *
 * Usage: node scripts/ai-search-audit.mjs [baseUrl]
 *        node scripts/ai-search-audit.mjs http://localhost:4321
 *        node scripts/ai-search-audit.mjs https://theo-ne.com
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');

const AI_AGENTS = {
  GPTBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot',
  'OAI-SearchBot': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot',
  ClaudeBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com',
  PerplexityBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot',
  'Google-Extended': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  Bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
};

const results = [];
const notes = [];

function check(category, weight, label, passed, detail) {
  results.push({ category, weight, label, passed: !!passed, earned: passed ? weight : 0, detail });
}
function partial(category, weight, label, ratio, detail) {
  const earned = Math.round(weight * Math.max(0, Math.min(1, ratio)) * 10) / 10;
  results.push({ category, weight, label, passed: earned >= weight * 0.999, earned, detail });
}

const get = async (url, ua) => {
  const res = await fetch(url, { headers: ua ? { 'User-Agent': ua } : {}, redirect: 'follow' });
  return { status: res.status, body: await res.text(), headers: res.headers };
};

const visibleText = (html) => {
  const body = html.split(/<body[^>]*>/)[1] ?? html;
  return body
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
};

const meta = (html, re) => (html.match(re) || [])[1] ?? null;
const jsonLdOf = (html) => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
};

/**
 * Body-length floors, per language.
 *
 * Applying one character count to both languages measures the writing system,
 * not the page: Korean says the same thing in far fewer characters. Measured on
 * the current pages, which carry identical content:
 *
 *     ko 967 chars / en 1683 chars = 0.5746
 *
 * So the English floor of 1000 corresponds to 1000 x 0.5746 = 575 in Korean.
 * Re-derive both numbers if the two locales ever stop carrying the same copy.
 */
const MIN_CHARS = { ko: 575, en: 1000 };

/**
 * Proof that the server rendered the page: every one of these has to be in the
 * raw HTML before any JavaScript runs. Deliberately hardcoded rather than read
 * from the locale files — an audit that reads the same source it checks proves
 * nothing.
 */
const SSR_ENTITIES = [
  '테오네',
  '수출·무역보험 서류 준비',
  '해외 거래 리스크 점검',
  '해외 진출 프로젝트 운영',
  '수출 실무·AI 활용 교육',
  'Teheranro AI Studio',
  'TROPS',
  '625-81-04032',
];

// ---------------------------------------------------------------- fetch pages
const ko = await get(`${BASE}/`, AI_AGENTS.GPTBot);
const en = await get(`${BASE}/en/`, AI_AGENTS.GPTBot);
const koText = visibleText(ko.body);
const enText = visibleText(en.body);

// ============================================ 1. JS-free crawlability  (30)
const C1 = 'JS 없이 읽히는가 (Crawlability)';
const ssrMissing = SSR_ENTITIES.filter((e) => !koText.includes(e));
check(C1, 12, 'SSR: core entities in raw HTML before any JS runs', ssrMissing.length === 0,
  ssrMissing.length ? `missing: ${ssrMissing.join(', ')}` : `all ${SSR_ENTITIES.length} present`);
const lenOk = [['ko', koText.length], ['en', enText.length]].map(([l, n]) => [l, n, n >= MIN_CHARS[l]]);
partial(C1, 6, 'Body length meets the per-language floor',
  lenOk.filter(([, , ok]) => ok).length / lenOk.length,
  lenOk.map(([l, n, ok]) => `${l} ${n}/${MIN_CHARS[l]}${ok ? '' : ' LOW'}`).join('  '));
check(C1, 6, 'Root element is not an empty shell', !/<div id="root">\s*<\/div>/.test(ko.body),
  /<div id="root">\s*<\/div>/.test(ko.body) ? 'root is empty: SPA not prerendered' : 'prerendered markup present');
const coreTokens = ['테오네', 'TROPS', 'Teheranro AI Studio', '범하나', 'contact@theo-ne.com', '625-81-04032'];
const foundTokens = coreTokens.filter((t) => koText.includes(t));
partial(C1, 6, 'Core entities present in static HTML', foundTokens.length / coreTokens.length,
  `${foundTokens.length}/${coreTokens.length}: ${foundTokens.join(', ')}`);

// ============================================ 2. AI crawler access    (15)
const C2 = 'AI 크롤러 접근 (Access)';
const robots = await get(`${BASE}/robots.txt`);
check(C2, 3, 'robots.txt reachable', robots.status === 200, `HTTP ${robots.status}`);
const mustAllow = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot',
                   'Google-Extended', 'Bingbot', 'Applebot-Extended', 'CCBot'];
const declared = mustAllow.filter((a) => new RegExp(`User-agent:\\s*${a}`, 'i').test(robots.body));
partial(C2, 8, 'Major AI crawlers explicitly allowed', declared.length / mustAllow.length,
  `${declared.length}/${mustAllow.length} named`);
check(C2, 2, 'Sitemap declared in robots.txt', /Sitemap:\s*http/i.test(robots.body),
  (robots.body.match(/Sitemap:.*/i) || ['none'])[0]);
// `/` is the Korean page, so it is held to the Korean floor.
const uaEntities = [];
const uaLength = [];
for (const [name, ua] of Object.entries(AI_AGENTS)) {
  const r = await get(`${BASE}/`, ua);
  const text = visibleText(r.body);
  uaEntities.push(`${name}:${r.status === 200 && SSR_ENTITIES.every((e) => text.includes(e)) ? 'OK' : 'FAIL'}`);
  uaLength.push(`${name}:${r.status === 200 && text.length >= MIN_CHARS.ko ? 'OK' : 'FAIL'}`);
}
const okCount = (rs) => rs.filter((r) => r.endsWith('OK')).length;
partial(C2, 1, 'Live fetch as each AI user-agent returns core entities',
  okCount(uaEntities) / uaEntities.length, uaEntities.join('  '));
partial(C2, 1, 'Live fetch as each AI user-agent returns a full-length body',
  okCount(uaLength) / uaLength.length, uaLength.join('  '));

// ============================================ 3. Structured data      (20)
const C3 = '구조화 데이터 (Structured data)';
const ld = jsonLdOf(ko.body);
const ldEn = jsonLdOf(en.body);
check(C3, 4, 'JSON-LD parses on both pages', !!ld && !!ldEn,
  ld && ldEn ? 'both valid' : 'missing or invalid');
const graph = ld?.['@graph'] ?? [];
const nodeOf = (t) => graph.find((n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).includes(t));
const org = nodeOf('Organization');
check(C3, 4, 'Organization: name, address, registration id, brand',
  !!(org?.name && org?.address?.streetAddress && org?.taxID && org?.brand?.name),
  org ? `taxID=${org.taxID}, brand=${org.brand?.name}` : 'absent');
const person = nodeOf('Person');
check(C3, 3, 'Person (founder) with job title, award + sameAs',
  !!(person?.name && person?.jobTitle && person?.award && person?.sameAs?.length),
  person ? `${person.name}, ${person.jobTitle}, award=${person.award}` : 'absent');
const app = nodeOf('SoftwareApplication');
check(C3, 3, 'SoftwareApplication (product) with url + publisher',
  !!(app?.name && app?.url && app?.publisher?.['@id']),
  app ? `${app.name} -> ${app.url}, publisher ${app.publisher?.['@id']}` : 'absent');
const faq = nodeOf('FAQPage');
const qCount = faq?.mainEntity?.length ?? 0;
partial(C3, 4, 'FAQPage with 5+ answered questions', qCount / 5,
  `${qCount} Q&A pairs`);
const ids = new Set(graph.filter((n) => n['@id']).map((n) => n['@id']));
const refs = new Set();
(function walk(o) {
  if (Array.isArray(o)) return o.forEach(walk);
  if (o && typeof o === 'object') {
    if (Object.keys(o).length === 1 && o['@id']) refs.add(o['@id']);
    Object.values(o).forEach(walk);
  }
})(graph);
const dangling = [...refs].filter((r) => !ids.has(r));
check(C3, 2, 'No dangling @id references', dangling.length === 0,
  dangling.length ? dangling.join(', ') : 'graph internally consistent');

// ============================================ 4. Answerability        (15)
// Questions a user would actually ask an AI, and the fact each answer needs.
const C4 = '질문 답변 가능성 (Answerability)';
const probes = [
  ['테오네는 어떤 회사인가?', ['해외 거래', '소프트웨어']],
  ['기업 지원으로 무엇을 요청할 수 있나?', ['수출·무역보험 서류 준비', '해외 거래 리스크 점검']],
  ['Teheranro AI Studio와 어떤 관계인가?', ['Teheranro AI Studio', '브랜드']],
  ['어떤 소프트웨어를 만드는가?', ['TROPS', 'Otherwise', 'Bar Route']],
  ['누가 창업했는가?', ['범하나', '뉴욕주 변호사']],
  ['법률 자문을 하는가?', ['법률 자문', '채권 추심']],
  ['연락 방법은?', ['contact@theo-ne.com']],
  ['사업자번호와 주소는?', ['625-81-04032', '강남구']],
  ['수상/선정 이력은?', ['KAIST OverEdge']],
];
const answered = probes.filter(([, facts]) => facts.every((f) => koText.includes(f)));
partial(C4, 15, 'Key questions answerable from static HTML alone',
  answered.length / probes.length,
  `${answered.length}/${probes.length} answerable` +
  (answered.length < probes.length
    ? ` | missing: ${probes.filter((p) => !answered.includes(p)).map((p) => p[0]).join('; ')}`
    : ''));

// ============================================ 5. Discovery surfaces   (10)
const C5 = '발견 경로 (Discovery)';
const sm = await get(`${BASE}/sitemap.xml`);
const smOk = sm.status === 200 && sm.body.includes('<urlset') &&
             sm.body.includes('/en/') && sm.body.includes('hreflang');
check(C5, 4, 'sitemap.xml with both locales + hreflang', smOk, `HTTP ${sm.status}`);
const llms = await get(`${BASE}/llms.txt`);
const llmsOk = llms.status === 200 && llms.body.includes('TROPS') &&
                llms.body.includes('Teheranro AI Studio') && llms.body.includes('625-81-04032');
check(C5, 3, 'llms.txt with company facts', llmsOk, `HTTP ${llms.status}, ${llms.body.length} bytes`);
const hasCanon = (h) => /<link rel="canonical"/.test(h);
const hreflangCount = (h) => (h.match(/rel="alternate" hreflang=/g) || []).length;
check(C5, 3, 'canonical + hreflang (ko/en/x-default) on both pages',
  hasCanon(ko.body) && hasCanon(en.body) && hreflangCount(ko.body) >= 3 && hreflangCount(en.body) >= 3,
  `ko:${hreflangCount(ko.body)} en:${hreflangCount(en.body)} alternates`);

// ============================================ 6. Snippet quality      (10)
const C6 = '스니펫 품질 (Snippet)';
const title = meta(ko.body, /<title>([^<]*)<\/title>/);
check(C6, 2, 'Title present and 15-70 chars',
  !!title && title.length >= 15 && title.length <= 70, `"${title}" (${title?.length})`);
const desc = meta(ko.body, /<meta name="description" content="([^"]*)"/);
check(C6, 2, 'Meta description 50-200 chars',
  !!desc && desc.length >= 50 && desc.length <= 200, `${desc?.length} chars`);
const ogKeys = ['og:title', 'og:description', 'og:image', 'og:image:width', 'og:url', 'og:type'];
const ogFound = ogKeys.filter((k) => ko.body.includes(`property="${k}"`));
partial(C6, 2, 'Open Graph complete', ogFound.length / ogKeys.length,
  `${ogFound.length}/${ogKeys.length}`);
check(C6, 1, 'Twitter card', /name="twitter:card"/.test(ko.body), 'summary_large_image');
const robotsMeta = meta(ko.body, /<meta name="robots" content="([^"]*)"/) || '';
check(C6, 2, 'robots meta permits full snippet + large image',
  robotsMeta.includes('max-snippet:-1') && robotsMeta.includes('max-image-preview:large'),
  robotsMeta || 'absent');
const ogImgUrl = meta(ko.body, /property="og:image" content="([^"]*)"/);
let ogImgOk = false, ogImgDetail = 'not checked';
if (ogImgUrl) {
  const local = ogImgUrl.replace(/^https?:\/\/[^/]+/, BASE);
  try {
    const r = await fetch(local);
    const buf = Buffer.from(await r.arrayBuffer());
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    ogImgOk = r.status === 200 && w === 1200 && h === 630;
    ogImgDetail = `HTTP ${r.status}, ${w}x${h}`;
  } catch (e) { ogImgDetail = e.message; }
}
check(C6, 1, 'og:image reachable at 1200x630', ogImgOk, ogImgDetail);

// ---------------------------------------------------------------- score
const cats = [...new Set(results.map((r) => r.category))].map((c) => {
  const rs = results.filter((r) => r.category === c);
  return {
    name: c,
    earned: Math.round(rs.reduce((a, r) => a + r.earned, 0) * 10) / 10,
    total: rs.reduce((a, r) => a + r.weight, 0),
    checks: rs,
  };
});
const earned = Math.round(cats.reduce((a, c) => a + c.earned, 0) * 10) / 10;
const total = cats.reduce((a, c) => a + c.total, 0);

notes.push(
  'This score measures AI-search readiness: whether an answer engine can fetch, parse and cite the site.',
  'It does not measure whether an engine already cites it, which depends on that engine\'s crawl and index schedule.'
);

const report = { base: BASE, earned, total, cats, notes,
  generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC' };
fs.writeFileSync(path.join(root, 'ai-search-report.json'), JSON.stringify(report, null, 2));

// ---------------------------------------------------------------- print
const bar = (e, t, w = 22) => {
  const n = Math.round((e / t) * w);
  return '#'.repeat(n) + '.'.repeat(w - n);
};
console.log(`\nAI SEARCH READINESS  ${BASE}\n${'='.repeat(74)}`);
for (const c of cats) {
  console.log(`\n${c.name}   ${c.earned}/${c.total}  [${bar(c.earned, c.total)}]`);
  for (const r of c.checks) {
    const mark = r.earned >= r.weight * 0.999 ? 'PASS' : r.earned > 0 ? 'PART' : 'FAIL';
    console.log(`  ${mark}  ${r.label}  (${r.earned}/${r.weight})`);
    if (r.detail) console.log(`        ${r.detail}`);
  }
}
console.log(`\n${'='.repeat(74)}`);
console.log(`TOTAL  ${earned} / ${total}   ${earned >= 90 ? 'PASS (>=90): cleared for deploy' : 'BELOW 90: not cleared'}`);
console.log(`${'='.repeat(74)}\n`);
process.exit(earned >= 90 ? 0 : 1);
