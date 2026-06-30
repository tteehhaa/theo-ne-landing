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
      
      {/* HTML을 직접 렌더링하여 줄바꿈 제어 */}
      <p 
        className="text-base md:text-lg max-w-2xl mx-auto leading-loose text-charcoal/80 mb-12"
        dangerouslySetInnerHTML={{ __html: t('hero.desc') }} 
      />

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
