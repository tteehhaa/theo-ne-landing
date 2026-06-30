import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ServiceSection() {
  const { t } = useTranslation();
  const serviceKeys = ['quick', 'mission', 'project'];

  return (
    <section id="services" className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif tracking-wide mb-4 text-charcoal">{t('services.title')}</h2>
        <p className="text-sm font-light text-charcoal/60">{t('services.desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {serviceKeys.map((key) => (
          <Card key={key} className="flex flex-col border-charcoal/10 bg-cream/50">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-4 bg-charcoal/5 text-charcoal/60 font-serif">{t(`services.${key}.badge`)}</Badge>
              <CardTitle className="text-xl font-serif tracking-wide text-charcoal">{t(`services.${key}.title`)}</CardTitle>
              <CardDescription className="pt-4 font-light text-charcoal/80 leading-relaxed">
                {t(`services.${key}.target`)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {/* 줄바꿈 가독성 개선: 단순 리스트 대신 스타일링된 텍스트 블록 사용 */}
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed font-light">
                {(t(`services.${key}.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                  <p key={idx} className="flex items-start">
                    <span className="mr-2">•</span> {item}
                  </p>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <a href={`?type=${key}#contact`} className="w-full">
                <Button className="w-full bg-charcoal text-cream hover:bg-[#2a2622] font-serif transition-colors">
                  {t(`services.${key}.btn`)}
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
