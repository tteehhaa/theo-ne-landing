// Single source of truth for everything the prerenderer needs that is not
// already in src/i18n/locales/*.json.

export const ORIGIN = 'https://theo-ne.com';

/**
 * Search-console ownership tokens (Google Search Console, 네이버 서치어드바이저).
 *
 * Supplied as build-time environment variables so the tokens stay out of the
 * repo — Vercel > Project > Settings > Environment Variables:
 *   GOOGLE_SITE_VERIFICATION  Search Console > HTML 태그 방식의 content 값만
 *   NAVER_SITE_VERIFICATION   서치어드바이저 > 사이트 소유확인 > HTML 태그의 content 값만
 *
 * Each holds a LIST — comma- or whitespace-separated — because a property can
 * be registered more than once (a second Naver Search Advisor property, say),
 * and every token has to keep being served or the older claim lapses. One tag
 * is emitted per token.
 *
 * An empty value simply omits the tag, so a local build works without them —
 * prerender.mjs warns when one is missing so a production build cannot lose
 * ownership silently.
 */
const tokenList = (value) =>
  (value ?? '')
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

export const VERIFICATION = {
  google: tokenList(process.env.GOOGLE_SITE_VERIFICATION),
  naver: tokenList(process.env.NAVER_SITE_VERIFICATION),
};

/**
 * IndexNow key. Bing and Naver both participate, so one ping reaches both;
 * Google does not support the protocol and still needs Search Console.
 *
 * Not a secret — the protocol requires it to be publicly readable at
 * `${ORIGIN}/${INDEXNOW_KEY}.txt`, which is what public/<key>.txt serves.
 * Changing this constant means renaming that file to match.
 */
export const INDEXNOW_KEY = '222366b31a2e7807519875307d2f793e';

/**
 * Google Analytics 4 measurement ID.
 *
 * Public by design — it ships in the page source of every visitor's browser —
 * so it belongs here as a constant, not in an environment variable like the
 * search-console tokens above. The tag is emitted only by the prerenderer, so
 * `npm run dev` traffic never reaches the property.
 */
export const GA_MEASUREMENT_ID = 'G-G022YZ9172';

export const OG_IMAGE = {
  path: '/og.png',
  enPath: '/og-en.png',
  width: 1200,
  height: 630,
  type: 'image/png',
};

/** Per-language preview image: English pages get their own rendering. */
export const ogImagePathFor = (lang) => (lang === 'en' ? OG_IMAGE.enPath : OG_IMAGE.path);

/** Korean business registration number, as shown in the footer. */
export const TAX_ID = '625-81-04032';

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/hanabeom/',
  trops: 'https://www.trops.kr/',
  teheranroai: 'https://www.teheranro-ai.com/',
};

export const LANGS = ['ko', 'en'];
export const DEFAULT_LANG = 'ko';

/** URL path for a language. Korean is the root; English lives under /en/. */
export const pathFor = (lang) => (lang === DEFAULT_LANG ? '/' : `/${lang}/`);
export const urlFor = (lang) => `${ORIGIN}${pathFor(lang)}`;

export const META = {
  ko: {
    locale: 'ko_KR',
    title: '(주)테오네 THÉONÉ Inc.',
    description:
      '(주)테오네는 기업의 해외 거래를 돕고, 반복되는 일은 Teheranro AI Studio 브랜드의 소프트웨어로 만듭니다.',
    siteName: '(주)테오네 THÉONÉ Inc.',
    ogImageAlt:
      '(주)테오네 THÉONÉ Inc. 기업의 해외 거래를 돕고, 반복되는 일은 소프트웨어로 만듭니다.',
    orgName: '(주)테오네',
    orgAlternateName: 'THÉONÉ Inc.',
    orgDescription: '기업의 해외 거래를 돕고, 반복되는 일은 소프트웨어로 만드는 회사',
    streetAddress: '봉은사로 524, B층 269-11호',
    addressLocality: '강남구',
    addressRegion: '서울특별시',
    brandName: 'Teheranro AI Studio',
    brandAlternateName: '테헤란로 AI 스튜디오',
    offerCatalogName: '기업 지원',
    founderJobTitle: '대표이사',
    founderAlternateName: 'Hana Beom',
  },
  en: {
    locale: 'en_US',
    title: 'THÉONÉ Inc.',
    description:
      'THÉONÉ Inc. helps companies trade overseas, and turns the work that repeats into software under the brand Teheranro AI Studio.',
    siteName: 'THÉONÉ Inc.',
    ogImageAlt:
      'THÉONÉ Inc. We help companies trade overseas, and turn the work that repeats into software.',
    orgName: 'THÉONÉ Inc.',
    orgAlternateName: '(주)테오네',
    orgDescription:
      'A company that helps businesses trade overseas and turns the work that repeats into software',
    // Decomposed from the mockup's own English footer line — no new wording.
    streetAddress: '524 Bongeunsa-ro, B269-11',
    addressLocality: 'Gangnam-gu',
    addressRegion: 'Seoul',
    brandName: 'Teheranro AI Studio',
    brandAlternateName: '테헤란로 AI 스튜디오',
    offerCatalogName: 'Business support',
    founderJobTitle: 'CEO',
    founderAlternateName: '범하나',
  },
};
