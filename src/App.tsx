import { useState } from 'react';
import './App.css';

type Language = 'ko' | 'en';

const content = {
  ko: {
    nav: {
      contact: 'Contact',
    },
    brand: {
      tagline: 'LEGAL TECH & CROSS-BORDER OPERATIONS',
    },
    service: {
      tagline: '"대표님은 법률 전략에 집중하십시오. 해외 프로젝트 운영은 저희가 책임집니다."',
      description: `Global Legal PM은 해외 사건을 수임하는 부티크 로펌을 위한 고효율 '외부 국제업무팀' 서비스입니다. 해외 로펌 소싱·검증부터 비용 협상, 크로스보더 커뮤니케이션 및 마일스톤 관리까지 크로스보더 프로젝트의 모든 운영 레이어를 전담합니다.`,
      status: 'Service Opening Soon',
    },
    founder: {
      name: 'HANA BEOM',
      nameKr: '범하나',
      title: 'CEO · Attorney-at-Law, NY',
      statement: '엔지니어의 정교한 시장 분석력과 뉴욕주 변호사의 국제 법무 전문성을 결합하여, THÉONÉ의 크로스보더 법률 프로젝트 관리(LPM) 및 자산 자문 인프라를 설계하고 조율합니다.',
    },
    footer: {
      email: 'contact@theo-ne.com',
      website: 'www.theo-ne.com',
      address: '서울시 강남구 봉은사로 524, 웨스틴 서울 파르나스 B269-11',
    },
  },
  en: {
    nav: {
      contact: 'Contact',
    },
    brand: {
      tagline: 'LEGAL TECH & CROSS-BORDER OPERATIONS',
    },
    service: {
      tagline: '"Focus on your legal strategy. We manage the global operations."',
      description: `Global Legal PM serves as a high-efficiency 'External International Legal Operations Team' for boutique law firms handling cross-border cases. We manage the entire operational layer—from sourcing and vetting local counsel to fee negotiation, cross-border communication, and milestone tracking.`,
      status: 'Service Opening Soon',
    },
    founder: {
      name: 'HANA BEOM',
      nameKr: '',
      title: 'CEO · Attorney-at-Law, NY',
      statement: 'Merging an engineer\'s sharp eye for market trends with a New York attorney\'s international legal expertise to orchestrate THÉONÉ\'s premium cross-border Legal Project Management (LPM) and strategic asset consulting infrastructure.',
    },
    footer: {
      email: 'contact@theo-ne.com',
      website: 'www.theo-ne.com',
      address: 'B269-11, Bongeunsa-ro 524, Gangnam-gu, Seoul, Republic of Korea',
    },
  },
};

function App() {
  const [lang, setLang] = useState<Language>('ko');

  const t = content[lang];

  const scrollToFooter = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          {/* Logo */}
          <h1 className="font-serif text-lg tracking-wide text-charcoal">
            THÉONÉ
          </h1>

          {/* Right side */}
          <div className="flex items-center gap-8">
            {/* Language Toggle */}
            <div className="flex items-center gap-2 text-xs font-light tracking-wide">
              <button
                onClick={() => setLang('ko')}
                className={`transition-opacity duration-300 ${
                  lang === 'ko' ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal/60'
                }`}
              >
                KO
              </button>
              <span className="text-charcoal/30">|</span>
              <button
                onClick={() => setLang('en')}
                className={`transition-opacity duration-300 ${
                  lang === 'en' ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal/60'
                }`}
              >
                EN
              </button>
            </div>

            {/* Contact Link */}
            <button
              onClick={scrollToFooter}
              className="text-xs font-light tracking-wide text-charcoal hover:text-charcoal/70 transition-opacity"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Brand Hero Section */}
          <section className="min-h-[55vh] flex flex-col items-center justify-center text-center mb-20">
            <div className="space-y-5 animate-fade-in">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide text-charcoal">
                THÉONÉ
              </h2>
              <p className="text-[10px] md:text-xs font-light tracking-[0.25em] text-charcoal/60 uppercase">
                {t.brand.tagline}
              </p>
            </div>

            {/* Accent Line */}
            <div className="mt-10 w-20 h-px bg-charcoal/25" />
          </section>

          {/* Service Section */}
          <section className="mb-20">
            <div className="max-w-2xl mx-auto">
              <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50">
                <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-6 tracking-wide">
                  Global Legal PM
                </h3>
                <p className="text-[10px] uppercase tracking-wider text-charcoal/50 mb-5">
                  External International Legal Operations Team
                </p>

                <blockquote className="font-serif text-sm lg:text-base text-charcoal/90 italic mb-6 leading-relaxed">
                  {t.service.tagline}
                </blockquote>

                <p className="text-xs lg:text-sm font-light leading-relaxed text-charcoal/75 mb-8">
                  {t.service.description}
                </p>

                {/* Service Opening Soon */}
                <p className="text-[10px] uppercase tracking-wider text-charcoal/40 border-t border-charcoal/15 pt-4 inline-block">
                  {t.service.status}
                </p>
              </div>
            </div>
          </section>

          {/* Founder Section - Separated from Service Box */}
          <section className="mb-28">
            <div className="text-center max-w-md mx-auto">
              <h4 className="font-serif text-lg lg:text-xl text-charcoal mb-1 tracking-wide">
                {t.founder.name}
                {t.founder.nameKr && (
                  <span className="text-charcoal/60 font-sans text-xs lg:text-sm ml-2">
                    ({t.founder.nameKr})
                  </span>
                )}
              </h4>
              <p className="text-[10px] lg:text-xs font-light tracking-widest text-charcoal/70 uppercase mb-5">
                {t.founder.title}
              </p>
              <p className="text-xs lg:text-sm font-light leading-relaxed text-charcoal/60">
                {t.founder.statement}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-cream border-t border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {/* Email */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-charcoal/40 mb-2">E.</p>
              <a
                href="mailto:contact@theo-ne.com"
                className="text-base lg:text-lg font-serif text-charcoal hover:text-charcoal/70 transition-colors tracking-wide"
              >
                {t.footer.email}
              </a>
            </div>

            {/* Website */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-charcoal/40 mb-2">W.</p>
              <p className="text-xs lg:text-sm font-light text-charcoal/70 tracking-wide">
                {t.footer.website}
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-charcoal/40 mb-2">A.</p>
              <p className="text-xs lg:text-sm font-light text-charcoal/60 leading-relaxed">
                {t.footer.address}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
