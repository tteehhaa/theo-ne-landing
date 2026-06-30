import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const LANGUAGES = { ko: 'KOR', en: 'ENG' } as const;
const NAV_ITEMS = ['services', 'innovation', 'international', 'about'] as const;

// 폰트를 font-serif로 변경하고, 텍스트 색상을 charcoal로 맞췄습니다.
const NAV_LINK_CLASS = "text-sm font-serif text-charcoal hover:text-charcoal/60 transition-colors";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal/10 bg-cream/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* 로고도 세리프체 적용 */}
        <a href="/" className="font-serif text-xl tracking-wide text-charcoal" aria-label="THÉONÉ Home">
          THÉONÉ
        </a>
        
        <nav className="hidden md:flex gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={NAV_LINK_CLASS}
            >
              {t(`nav.${item}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLanguage}
            className="font-serif text-charcoal hover:bg-charcoal/5"
            aria-label={`Switch to ${i18n.language === 'ko' ? 'ENG' : 'KOR'}`}
          >
            {LANGUAGES[i18n.language as keyof typeof LANGUAGES]}
          </Button>
          <a href="#contact">
            {/* 버튼 스타일도 차콜/크림 톤에 맞춰서 조정 */}
            <Button size="sm" className="bg-charcoal text-cream hover:bg-charcoal/90 font-serif">
              {t('nav.cta')}
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
