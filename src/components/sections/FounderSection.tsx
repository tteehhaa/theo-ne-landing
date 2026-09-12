import { useTranslation } from "react-i18next";
import { LINKS } from "@site";
import { useReveal } from "@/hooks/use-reveal";

export default function FounderSection() {
  const { t } = useTranslation();
  const items = t('founder.items', { returnObjects: true }) as string[];
  const { ref, go } = useReveal<HTMLElement>(0.25);

  return (
    <section id="founder" aria-labelledby="founder-h" ref={ref} className={go ? 'reveal go' : 'reveal'}>
      <div className="section-head">
        <h2 id="founder-h" className="eyebrow">{t('founder.heading')}</h2>
      </div>
      <div className="person">
        <p className="person-name">
          <span className="t-heading">{t('founder.name')}</span>
          <small>{t('founder.role')}</small>
        </p>
        <ul className="spec">
          {items.map((item, i) => (
            <li key={item} style={{ '--i': i } as React.CSSProperties}>{item}</li>
          ))}
        </ul>
        <p className="more">
          <a className="btn btn-ghost" href={LINKS.linkedin}>{t('founder.linkedin')}</a>
        </p>
      </div>
    </section>
  );
}
