import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="font-bold text-xl tracking-tight">THÉONÉ</a>
        
        <nav className="hidden md:flex gap-6">
          <a href="#services" className="text-sm font-medium hover:text-primary/80">{t('nav.services')}</a>
          <a href="#innovation" className="text-sm font-medium hover:text-primary/80">{t('nav.innovation')}</a>
          <a href="#international" className="text-sm font-medium hover:text-primary/80">{t('nav.international')}</a>
          <a href="#about" className="text-sm font-medium hover:text-primary/80">{t('nav.about')}</a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            {i18n.language === 'ko' ? 'ENG' : 'KOR'}
          </Button>
          <a href="#contact">
            <Button size="sm">{t('nav.cta')}</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
