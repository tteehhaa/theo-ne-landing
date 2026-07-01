import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 text-center container mx-auto px-6">
      {/* 타이틀 굵게 처리 및 tracking-wide로 여유로운 느낌 부여 */}
      <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-8 tracking-wide">
        {t('hero.title')}
      </h1>
      
      <p className="text-xl md:text-2xl text-charcoal/70 font-serif font-light mb-10">
        {t('hero.subtitle')}
      </p>
      
      {/* 
        text-balance를 적용하여 기기별 너비에 따라 
        브라우저가 가장 자연스러운 줄바꿈 지점을 자동으로 결정합니다.
      */}
      <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-charcoal/80 mb-12 text-balance">
        {t('hero.desc')}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a href="#services">
          <Button size="lg" className="bg-charcoal text-cream hover:bg-[#2a2622] font-serif px-8">
            {t('hero.btnServices')}
          </Button>
        </a>
        <a href="#contact">
          <Button size="lg" variant="outline" className="border-charcoal/20 text-charcoal hover:bg-charcoal/5 font-serif px-8">
            {t('hero.btnContact')}
          </Button>
        </a>
      </div>
    </section>
  );
}
