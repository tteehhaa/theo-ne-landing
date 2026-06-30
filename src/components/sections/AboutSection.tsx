import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-12 container mx-auto px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* 1. About THÉONÉ 섹션 (내용 유지 및 수정) */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50 text-center flex flex-col items-center">
          <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-6 tracking-wide">
            {t('about.title')}
          </h3>
          <div className="space-y-6 flex flex-col items-center">
            <p className="text-sm font-light leading-relaxed text-charcoal/80 max-w-lg">
              {t('about.identity')}
            </p>
            <p className="text-xs font-light text-charcoal/50 border-l border-charcoal/20 pl-4 py-1 max-w-md">
              {t('about.compliance')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
