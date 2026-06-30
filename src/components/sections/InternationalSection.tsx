import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function InternationalSection() {
  const { t } = useTranslation();

  return (
    <section id="international" className="py-16 container mx-auto">
      <div className="max-w-4xl mx-auto border rounded-xl p-8 md:p-12 text-center space-y-6 bg-card">
        <h2 className="text-2xl font-bold">{t('international.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('international.notice')}</p>
        
        <div className="space-y-4 bg-muted/30 p-6 rounded-lg text-left">
          <p className="text-sm font-semibold italic text-primary">{t('international.inbound')}</p>
          <p className="text-sm leading-relaxed">{t('international.value')}</p>
        </div>

        <a href="?type=international#contact" className="inline-block pt-4">
          <Button variant="secondary">{t('international.btn')}</Button>
        </a>
      </div>
    </section>
  );
}
