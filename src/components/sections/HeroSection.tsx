import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32 text-center container mx-auto px-6">
      <h1 className="text-4xl md:text-6xl font-serif text-charcoal mb-8 tracking-wide">
        {t('hero.title')}
      </h1>
      
      <p className="text-xl md:text-2xl text-charcoal/70 font-serif font-light mb-10">
        {t('hero.subtitle')}
      </p>
      
      {/* 
        가독성을 위해 문장을 의미 단위로 명확하게 구성합니다.
        줄바꿈이 필요한 지점에서 <br className="hidden md:block" />을 사용하세요.
      */}
      <p className="text-base md:text-lg max-w-2xl mx-auto leading-loose text-charcoal/80 mb-12">
        {t('hero.descPart1')}
        <br className="hidden md:block" />
        {t('hero.descPart2')}
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
