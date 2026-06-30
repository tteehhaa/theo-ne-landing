import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function InnovationSection() {
  const { t } = useTranslation();

  return (
    <section id="innovation" className="py-16 bg-muted/50">
      <div className="container mx-auto max-w-3xl text-center space-y-6">
        <h2 className="text-2xl font-bold">{t('innovation.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('innovation.notice1')}</p>
        
        <div className="space-y-4 text-left bg-background p-6 rounded-lg border">
          <p className="text-sm font-medium">• {t('innovation.item1')}</p>
          <p className="text-sm font-medium">• {t('innovation.item2')}</p>
        </div>

        <p className="text-sm text-muted-foreground pt-4">{t('innovation.notice2')}</p>
        <a href="?type=rnd#contact" className="inline-block">
          <Button variant="default">{t('innovation.btn')}</Button>
        </a>
      </div>
    </section>
  );
}
