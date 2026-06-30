import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ServiceSection() {
  const { t } = useTranslation();

  const serviceKeys = ['quick', 'mission', 'project'];

  return (
    <section id="services" className="py-24 container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">{t('services.title')}</h2>
        <p className="text-muted-foreground">{t('services.desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {serviceKeys.map((key) => (
          <Card key={key} className="flex flex-col hover:-translate-y-1 transition duration-300">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-4">{t(`services.${key}.badge`)}</Badge>
              <CardTitle className="text-xl">{t(`services.${key}.title`)}</CardTitle>
              <CardDescription className="pt-4 font-medium text-foreground">
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
