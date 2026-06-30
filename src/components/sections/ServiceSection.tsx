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
        {/* font-bold 대신 font-serif로 변경 */}
        <h2 className="text-3xl font-serif tracking-wide mb-4 text-charcoal">{t('services.title')}</h2>
        <p className="text-sm font-light text-charcoal/60">{t('services.desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {serviceKeys.map((key) => (
          <Card key={key} className="flex flex-col hover:-translate-y-1 transition duration-300 border-charcoal/10 bg-cream/50">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-4 bg-charcoal/5 text-charcoal/60">{t(`services.${key}.badge`)}</Badge>
              {/* 카드 제목도 세리프체로 통일 */}
              <CardTitle className="text-xl font-serif tracking-wide text-charcoal">{t(`services.${key}.title`)}</CardTitle>
              <CardDescription className="pt-4 font-light text-charcoal/80">
                {t(`services.${key}.target`)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                {(t(`services.${key}.items`, { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <a href={`?type=${key}#contact`} className="w-full">
                <Button className="w-full" variant="outline">{t(`services.${key}.btn`)}</Button>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
