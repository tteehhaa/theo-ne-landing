import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function InnovationSection() {
  const { t } = useTranslation();

  return (
    <section id="innovation" className="py-12 container mx-auto px-6">
      <div className="max-w-2xl mx-auto">
        {/* 모든 요소를 중앙 정렬하고 일정한 간격 유지 */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50 text-center flex flex-col items-center">
          
          <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-6 tracking-wide font-bold">
            {t('innovation.title')}
          </h3>
          
          <p className="text-xs lg:text-sm font-light leading-relaxed text-charcoal/75 mb-8 max-w-lg">
            {t('innovation.desc')}
          </p>

          <a href="?type=rnd#contact">
            <Button className="bg-charcoal text-cream hover:bg-[#2a2622] font-serif px-8">
              {t('innovation.btn')}
            </Button>
          </a>
          
        </div>
      </div>
    </section>
  );
}
