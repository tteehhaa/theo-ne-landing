import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = ['services', 'innovation', 'international', 'about'] as const;
const NAV_LINK_CLASS = "text-sm font-serif text-charcoal hover:text-charcoal/60 transition-colors";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal/10 bg-cream/95 backdrop-blur-sm">
      {/* 1. 좌측 여백을 위해 container에 px-6 추가, 로고에 ml-4 추가 */}
      <div className="container mx-auto px-6 flex h-16 items-center justify-between">
        <a href="/" className="font-serif text-xl tracking-wide text-charcoal ml-4" aria-label="THÉONÉ Home">
          THÉONÉ
        </a>
        
        <nav className="hidden md:flex gap-8">
          {NAV_ITEMS.map((item) => (
            <a key={item} href={`#${item}`} className={NAV_LINK_CLASS}>
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* 2. 언어 버튼 로직 반전: 한국어일 때 ENG, 영어일 때 KOR 표시 */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="font-serif text-charcoal hover:bg-charcoal/10 hover:text-charcoal transition-all"
          >
            {i18n.language === 'ko' ? 'ENG' : 'KOR'}
          </Button>
          
          <a href="#contact">
            {/* 4. 버튼 시각적 일체감 강화 */}
            <Button size="sm" className="bg-charcoal text-cream hover:bg-[#2a2622] font-serif transition-colors px-6">
              {t('nav.cta')}
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
