import { useState } from 'react';
import { Globe, Mail, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white antialiased">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-widest text-white">THÉONÉ</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 border border-neutral-800 rounded-full px-3 py-1 bg-neutral-900/50">
              <button 
                onClick={() => setLang('KO')} 
                className={`transition-colors duration-200 px-2 py-0.5 rounded-full text-xs font-medium ${lang === 'KO' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                KO
              </button>
              <span className="text-neutral-700">|</span>
              <button 
                onClick={() => setLang('EN')} 
                className={`transition-colors duration-200 px-2 py-0.5 rounded-full text-xs font-medium ${lang === 'EN' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                EN
              </button>
            </div>
            <a 
              href="mailto:contact@theo-ne.com" 
              className="text-neutral-400 hover:text-white transition-colors duration-200 font-medium"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        
        {/* HERO SECTION - MAIN — GLOBAL BUSINESS PM */}
        <section className="space-y-8 animate-fade-in">
          <div className="space-y-3">
            <div className="text-xs font-semibold tracking-wider text-neutral-500 uppercase flex items-center space-x-2">
              <span>Main</span>
              <span>—</span>
              <span className="text-neutral-400">Global Business PM</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Global Business PM
            </h1>
            <p className="text-lg md:text-xl font-medium tracking-wide text-neutral-400 font-mono italic">
              Fractional Global Business Director
            </p>
          </div>

          <div className="max-w-2xl border-l-2 border-neutral-800 pl-6 space-y-4">
            <p className="text-lg md:text-xl font-medium leading-relaxed text-neutral-200">
              {lang === 'KO' 
                ? "해외 진출을 원하지만, 전담 인력을 채용하기엔 이른 기업을 위한 솔루션입니다."
                : "The ultimate solution for enterprises aspiring for global expansion, yet finding it premature to hire a full-time international department."
              }
            </p>
            <p className="text-base md:text-lg leading-relaxed text-neutral-400">
              {lang === 'KO'
                ? "프로젝트 단위로 운영되는 Fractional 글로벌 비즈니스 PM 시스템이 실행부터 리스크 관리까지 담당합니다."
                : "Our project-based Fractional Global Business PM system commands everything from seamless execution to cross-border risk management."
              }
            </p>
          </div>

          {/* CREDENTIAL BADGES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-2xl">
            <div className="flex items-center space-x-3 border border-neutral-900 rounded-xl p-4 bg-neutral-900/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-neutral-600 shadow-[0_0_8px_rgba(115,115,115,0.5)]" />
              <span className="text-sm font-medium text-neutral-300">
                {lang === 'KO' ? "정부 기관(NIPA) 글로벌 전문가 등록" : "Certified Global ICT Expert by NIPA"}
              </span>
            </div>
            <div className="flex items-center space-x-3 border border-neutral-900 rounded-xl p-4 bg-neutral-900/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-neutral-600 shadow-[0_0_8px_rgba(115,115,115,0.5)]" />
              <span className="text-sm font-medium text-neutral-300">
                {lang === 'KO' ? "코트라 두바이 무역관 UAE K-MOVE 멘토" : "KOTRA Dubai Move Overseas Mentorship Board"}
              </span>
            </div>
          </div>

          {/* VALUE PROPOSITION CORE */}
          <div className="pt-6 max-w-3xl space-y-4">
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-light">
              {lang === 'KO'
                ? "글로벌 파트너십 구축부터 계약·운영 전반까지, 해외 진출에는 타이밍과 리스크 관리가 전부입니다."
                : "From building international partnerships to executing cross-border operations, global expansion is entirely about timing and risk mitigation."
              }
            </p>
            <p className="text-base md:text-lg text-neutral-200 font-medium leading-relaxed">
              {lang === 'KO'
                ? "놓치기 쉬운 리스크를 선제적으로 차단하고 실행 속도를 지키는 Fractional 글로벌 비즈니스 PM 시스템을 활용하세요."
                : "Leverage our Fractional Global Business PM system to preemptively neutralize hidden threats and accelerate your speed to market."
              }
            </p>
          </div>
        </section>

        {/* TECHNOLOGY & VISION SECTION */}
        <section className="space-y-8 border-t border-neutral-900 pt-16">
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
              Our Technology & Vision
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Tech-enabled Global Business PM
            </h3>
            <p className="text-neutral-400 font-medium text-base md:text-lg pt-1 border-b border-neutral-900 pb-4 max-w-xl">
              {lang === 'KO'
                ? "생성형 AI의 처리 속도에 전문가의 판단력을 더한, 빠르고 정확한 글로벌 비즈니스 PM 시스템입니다."
                : "A fast and accurate Global Business PM system—combining the unyielding processing speed of Generative AI with strategic expert insight."
              }
            </p>
          </div>

          <Card className="bg-neutral-900/20 border-neutral-900 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <p className="text-base md:text-lg text-neutral-300 leading-relaxed font-light">
                {lang === 'KO'
                  ? "생성형 AI의 처리 속도를 기반으로, 뉴욕주 변호사와 국가 공인 글로벌 전문가가 직접 비즈니스 리스크를 검증하는 이중 구조로 작동합니다."
                  : "Operating on a dual-engine architecture, our infrastructure leverages the lightning-fast velocity of Generative AI agents, fortified by the rigorous, hands-on risk verification of NY attorneys and government-certified global experts."
                }
              </p>
              <div className="space-y-2 border-t border-neutral-900/60 pt-6">
                <p className="text-base md:text-lg text-neutral-200 font-medium">
                  {lang === 'KO'
                    ? "솔루션을 활용할수록 귀사의 비즈니스 맥락에 최적화된 독점적 글로벌 PM 인프라가 축적됩니다."
                    : "The more you utilize the solution, the more your company accumulates a proprietary global PM infrastructure hyper-optimized to your unique business context."
                  }
                </p>
                <p className="text-base md:text-lg text-neutral-400 font-semibold font-mono tracking-wide">
                  {lang === 'KO' ? "이것이 저희가 추구하는 플라이휠입니다." : "This is the flywheel we pursue."}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CEO PROFILE SECTION */}
        <section className="space-y-8 border-t border-neutral-900 pt-16">
          <div className="space-y-1">
            <h2 className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
              CEO Profile
            </h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* AVATAR PLACEHOLDER MATCHING LUXURY UX */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-between shadow-inner">
                <span className="text-sm font-bold text-neutral-400 tracking-wider w-full text-center">HB</span>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <h3 className="text-2xl font-bold text-white">
                    {lang === 'KO' ? "범하나" : "Hana Beom"}
                  </h3>
                  <span className="text-sm text-neutral-400 font-medium">
                    CEO · Attorney-at-Law, NY
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs font-mono text-neutral-500 font-medium">
                  <span>#뉴욕주변호사</span>
                  <span>•</span>
                  <span>#글로벌PM</span>
                  <span>•</span>
                  <span>#Cross_border</span>
                </div>
              </div>

              <p className="text-base text-neutral-300 leading-relaxed max-w-2xl font-light">
                {lang === 'KO'
                  ? "엔지니어의 데이터 분석력과 뉴욕주 변호사의 리스크 관리 전문성 — 그 경계에서 크로스보더 비즈니스의 실행 구조를 설계합니다."
                  : "Bridging the precision of an engineer’s data analysis with the elite risk management expertise of a New York attorney—orchestrating the operational architecture of cross-border commerce."
                }
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER AREA */}
      <footer className="border-t border-neutral-900 bg-neutral-950 mt-24 py-12 text-sm text-neutral-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8 md:items-center">
          <div className="space-y-3">
            <span className="font-bold text-neutral-400 tracking-widest block text-base">THÉONÉ</span>
            <div className="space-y-1 text-neutral-500 font-light">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-neutral-600" />
                <a href="mailto:contact@theo-ne.com" className="hover:text-neutral-300 transition-colors">contact@theo-ne.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-neutral-600" />
                <a href="https://www.theo-ne.com" className="hover:text-neutral-300 transition-colors">www.theo-ne.com</a>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <MapPin className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                <span>
                  {lang === 'KO'
                    ? "서울시 강남구 봉은사로 524, 인터콘티넨탈 서울 코엑스 B269-11"
                    : "B269-11, Bongeunsa-ro 524, Gangnam-gu, Seoul, Republic of Korea"
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-neutral-600 text-xs font-mono md:text-right">
            &copy; {new Date().getFullYear()} THÉONÉ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
