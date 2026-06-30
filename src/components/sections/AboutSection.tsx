import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-12 container mx-auto px-6">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* 1. About THÉONÉ 섹션 */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50">
          <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-6 tracking-wide">
            {t('about.title')}
          </h3>
          <div className="space-y-6">
            <p className="text-sm font-light leading-relaxed text-charcoal/80">
              {t('about.identity')}
            </p>
            <p className="text-xs font-light text-charcoal/50 border-l border-charcoal/20 pl-4 py-1">
              {t('about.compliance')}
            </p>
          </div>
        </div>

        {/* 2. Founder Hana Beom 섹션 */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50">
          <h3 className="font-serif text-xl lg:text-2xl text-charcoal mb-6 tracking-wide">
            {t('about.founderName')}
          </h3>
          <p className="text-sm font-light leading-relaxed text-charcoal/80 mb-8">
            {t('about.founderDesc')}
          </p>
          <Button variant="outline" className="border-charcoal/20 text-charcoal hover:bg-charcoal/5 font-serif" asChild>
            <a href="https://www.linkedin.com/in/hanabeom" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-4 h-4 mr-2" />
              {t('about.linkedinBtn')}
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
