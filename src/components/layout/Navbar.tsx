import { useTranslation } from "react-i18next";
import { LANGS, pathForLang, type Lang } from "@/i18n";

const LABELS: Record<Lang, string> = { ko: 'KO', en: 'EN' };

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const current = i18n.language as Lang;

  return (
    <header>
      <div className="wrap bar">
        <a className="wordmark" href="#top">THÉONÉ</a>
        <nav aria-label={t('nav.menuLabel')}>
          <div className="pills">
            <a className="pill hide-m" href="#work">{t('nav.work')}</a>
            <a className="pill hide-m" href="#founder">{t('nav.founder')}</a>
            <a className="pill" href="#contact">{t('nav.contact')}</a>
          </div>
          {/* Real links, not a client-side toggle, so each language is its own
              crawlable URL and the pair can carry hreflang. */}
          <div className="lang" role="group" aria-label={t('nav.langLabel')}>
            {LANGS.map((lang) => (
              <a
                key={lang}
                href={pathForLang(lang)}
                hrefLang={lang}
                aria-current={current === lang ? 'page' : undefined}
              >
                {LABELS[lang]}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
