import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function InnovationSection() {
  const { t } = useTranslation();

  return (
    <section id="innovation" className="py-24 bg-cream/30">
      <div className="container mx-auto max-w-2xl text-center space-y-8">
        {/* 제목 세리프체 적용 */}
        <h2 className="text-3xl font-serif text-charcoal tracking-wide">AI 워크플로우 인프라</h2>
        
        <p className="text-sm font-light text-charcoal/80 leading-relaxed">
          AI 기반으로 글로벌 거래의 신뢰와 안전을 높이는 리스크 관리 솔루션을 개발하고 있습니다.
        </p>

        <a href="?type=rnd#contact" className="inline-block">
          <Button className="bg-charcoal text-cream hover:bg-[#2a2622] font-serif px-8">
            {t('innovation.btn')}
          </Button>
        </a>
      </div>
    </section>
  );
}
