import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function InternationalSection() {
  const { t } = useTranslation();

  return (
    <section id="international" className="py-12 container mx-auto px-6">
      <div className="max-w-2xl mx-auto">
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50 text-center flex flex-col items-center">
          
          <h2 className="text-3xl font-serif font-bold tracking-wide mb-4 text-charcoal">
            {t('international.title')}
          </h2>

          <p className="text-xs lg:text-sm font-light leading-relaxed text-charcoal/75 mb-8 max-w-lg">
            {t('international.value')}
          </p>

          {/* a 태그 제거 및 onClick 이벤트 적용 */}
          <Button 
            className="bg-charcoal text-cream hover:bg-[#2a2622] font-serif px-8"
            onClick={() => {
              // 문의 유형 저장
              localStorage.setItem('inquiryType', 'international');
              
              // 문의 섹션으로 부드럽게 이동
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {t('international.btn')}
          </Button>
          
        </div>
      </div>
    </section>
  );
}
