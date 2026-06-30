import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 text-center container mx-auto px-4">
      {/* font-bold를 제거하고 font-serif와 tracking-wide를 추가합니다 */}
      <h1 className="text-4xl md:text-6xl font-serif tracking-wide mb-6 text-charcoal">
        {t('hero.title')}
      </h1>
      
      {/* 서브 타이틀은 조금 더 가벼운 느낌으로 조정 가능합니다 */}
      <p className="text-xl md:text-2xl text-charcoal/70 font-light mb-8">
        {t('hero.subtitle')}
      </p>
      
      <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-10 text-charcoal/80">
        {t('hero.desc')}
      </p>
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
