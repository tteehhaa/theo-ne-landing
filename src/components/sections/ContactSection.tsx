import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/use-reveal";

export default function ContactSection() {
  const { t } = useTranslation();
  const email = t('contact.email');
  const { ref, go } = useReveal<HTMLElement>(0.3);

  return (
    <section id="contact" className={go ? 'contact reveal go' : 'contact reveal'} aria-labelledby="contact-h" ref={ref}>
      <div className="contact-card">
        <div>
          <h2 id="contact-h" className="eyebrow">{t('contact.heading')}</h2>
          <a className="mail" href={`mailto:${email}`}>{email}</a>
        </div>
        <a className="btn btn-primary" href={`mailto:${email}`}>{t('work.support.cta')}</a>
      </div>
    </section>
  );
}
