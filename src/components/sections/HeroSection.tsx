import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 text-center container mx-auto px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{t('hero.title')}</h1>
      <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-8">{t('hero.subtitle')}</p>
      <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-10">{t('hero.desc')}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href="#services">
          <Button size="lg" className="w-full sm:w-auto">{t('hero.btnServices')}</Button>
        </a>
        <a href="#contact">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">{t('hero.btnContact')}</Button>
        </a>
      </div>
    </section>
  );
}
