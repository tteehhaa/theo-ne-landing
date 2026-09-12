import { Fragment } from "react";
import { useTranslation } from "react-i18next";

interface FaqItem {
  q: string;
  a: string;
}

/**
 * The statement is the headline; the legal name moves up into the eyebrow.
 * The supporting line reuses the first FAQ answer so the hero never carries
 * copy that does not already exist in the locale file.
 *
 * The load sequence is pure CSS (`--i` sets each line's delay) so it runs as
 * soon as the stylesheet applies — no hydration to wait for — and only under
 * `<html class="js">`.
 */
export default function HeroSection() {
  const { t } = useTranslation();
  const lede = t('hero.lede', { returnObjects: true }) as string[];
  const faq = t('faq.items', { returnObjects: true }) as FaqItem[];
  const at = (i: number) => ({ '--i': i } as React.CSSProperties);

  return (
    <div className="hero">
      <div className="hero-stack">
        <p className="eyebrow rise" style={at(0)}>
          <span>{t('hero.name')}</span>
          <span>{t('hero.nameAlt')}</span>
        </p>
        <h1 className="t-hero rise" style={at(1)}>
          {lede.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h1>
        <p className="lede t-subtitle rise" style={at(2)}>{faq[0].a}</p>
        <p className="ctas rise" style={at(3)}>
          <a className="btn btn-primary" href="#contact">{t('work.support.cta')}</a>
          <a className="btn btn-secondary" href="#work">{t('nav.work')}</a>
        </p>
      </div>
    </div>
  );
}
