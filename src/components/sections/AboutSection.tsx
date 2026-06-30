import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function InternationalSection() {
  const { t } = useTranslation();

  return (
    <section id="international" className="py-12 container mx-auto px-6">
      {/* ServiceSection과 동일한 최대 너비 제한 */}
      <div className="max-w-2xl mx-auto">
        {/* 테두리, 패딩, 배경색 및 중앙 정렬 구조 통일 */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50 text-center flex flex-col items-center">
          
          <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-6 tracking-wide">
            {t('international.title')}
          </h3>
          
          <p className="text-xs lg:text-sm font-light leading-relaxed text-charcoal/75 mb-8 max-w-lg">
            {t('international.value')}
          </p>

          <a href="?type=international#contact">
            <Button className="bg-charcoal text-cream hover:bg-[#2a2622] font-serif px-8">
              {t('international.btn')}
            </Button>
          </a>
          
        </div>
      </div>
    </section>
  );
}
