Skip to content
tteehhaa
theo-ne-landing
Repository navigation
Code
Issues
Pull requests
Agents
Actions
Projects
Wiki
Security and quality
Insights
Settings
theo-ne-landing/src/components/sections
/
HeroSection.tsx
in
main

Edit

Preview
Indent mode

Spaces
Indent size

2
Line wrap mode

No wrap
Editing HeroSection.tsx file contents
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
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
      
      {/* 가독성을 위한 폭 제한 및 줄간격 수정 */}
      <p className="text-base md:text-lg max-w-2xl mx-auto leading-loose text-charcoal/80 mb-12">
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

Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
