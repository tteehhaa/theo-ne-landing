import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/use-reveal";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection() {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];
  const { ref, go } = useReveal<HTMLElement>(0.15);

  return (
    <section id="faq" aria-labelledby="faq-h" ref={ref} className={go ? 'reveal go' : 'reveal'}>
      <div className="section-head">
        <h2 id="faq-h" className="eyebrow">{t('faq.heading')}</h2>
      </div>
      <div className="faq">
        {items.map((item, i) => (
          <details key={item.q} open={i === 0} style={{ '--i': i } as React.CSSProperties}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
