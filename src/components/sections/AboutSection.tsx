import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* 테두리와 여백을 조절하여 디자인 통일감 부여 */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50 text-center flex flex-col items-center">
          
          {/* 타이틀 굵게 처리 */}
          <h2 className="text-3xl font-serif font-bold tracking-wide mb-8 text-charcoal">
            {t('about.title')}
          </h2>
          
          <div className="space-y-10 flex flex-col items-center w-full">
            {/* 
              1. max-w를 3xl로 늘려 여유 확보 
              2. text-balance로 기기별 동적 줄바꿈 최적화
            */}
            <p className="text-base md:text-lg leading-relaxed text-charcoal/80 max-w-2xl text-balance">
              {t('about.identity')}
            </p>
            
            {/* 고지 사항은 왼쪽 정렬을 기본으로 하여 문장 끊김 방지 */}
            <p className="text-xs font-light text-charcoal/50 border-l border-charcoal/20 pl-6 py-1 max-w-lg text-left">
              {t('about.compliance')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
