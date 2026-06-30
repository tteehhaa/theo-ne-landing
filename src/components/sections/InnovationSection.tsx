import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function InnovationSection() {
  const { t } = useTranslation();

  return (
    <section id="innovation" className="py-12 container mx-auto px-6">
      {/* ServiceSection과 동일한 최대 너비 제한 */}
      <div className="max-w-2xl mx-auto">
        {/* 테두리, 패딩, 배경색을 ServiceSection과 통일 */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50">
          <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-6 tracking-wide">
            AI 워크플로우 인프라
          </h3>
          
          <p className="text-xs lg:text-sm font-light leading-relaxed text-charcoal/75 mb-8">
            AI 기반으로 글로벌 거래의 신뢰와 안전을 높이는 리스크 관리 솔루션을 개발하고 있습니다.
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
