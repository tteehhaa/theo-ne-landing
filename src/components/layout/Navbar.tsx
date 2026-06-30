import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const LANGUAGES = { ko: 'KOR', en: 'ENG' } as const;
const NAV_ITEMS = ['services', 'innovation', 'international', 'about'] as const;
const NAV_LINK_CLASS = "text-sm font-medium hover:text-primary/80";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="font-bold text-xl tracking-tight" aria-label="THÉONÉ Home">
          THÉONÉ
        </a>
        
        <nav className="hidden md:flex gap-6">
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
            aria-label={`Switch to ${LANGUAGES[i18n.language === 'ko' ? 'en' : 'ko']}`}
          >
            {LANGUAGES[i18n.language as keyof typeof LANGUAGES]}
          </Button>
          <a href="#contact">
            <Button size="sm">{t('nav.cta')}</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
