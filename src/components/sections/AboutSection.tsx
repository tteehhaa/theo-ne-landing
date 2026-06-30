import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold mb-12 text-center">{t('about.title')}</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-primary">{t('about.philosophy')}</h3>
            <p className="text-base font-medium">{t('about.identity')}</p>
            <p className="text-sm text-muted-foreground border-l-4 border-muted pl-4 py-1">
              {t('about.compliance')}
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="text-lg font-bold">{t('about.founderName')}</h4>
              <p className="text-sm leading-relaxed">{t('about.founderDesc')}</p>
              <Button variant="outline" size="sm" asChild className="w-full md:w-auto mt-4">
                <a href="https://www.linkedin.com/in/hanabeom" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  {t('about.linkedinBtn')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
