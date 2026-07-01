import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitInquiry } from "@/lib/submitInquiry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  type: z.string().min(2),
  message: z.string().min(10),
});

export default function ContactSection() {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", company: "", email: "", phone: "", type: "", message: "" },
  });

useEffect(() => {
    // 1. URL 파라미터 확인 (기존 기능)
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type");

    // 2. localStorage 확인 (새로 추가된 기능)
    const storedType = localStorage.getItem('inquiryType');

    // 3. 우선순위: URL 파라미터가 있으면 우선 적용, 없으면 localStorage 확인
    const finalType = typeParam || storedType;

    if (finalType) {
      form.setValue("type", finalType);
      
      // localStorage는 사용 후 즉시 비워야 나중에 다른 페이지 방문 시 영향 없음
      if (storedType) {
        localStorage.removeItem('inquiryType');
      }
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await submitInquiry(values);
      toast.success(t('contact.success'));
      form.reset();
    } catch (error) {
      toast.error(t('contact.error'));
    }
  }

  return (
    <section id="contact" className="py-24 container mx-auto px-6 max-w-2xl">
      {/* 제목에 font-serif 적용 */}
      <h2 className="text-3xl font-serif font-bold text-center mb-12 tracking-wide text-charcoal">
  {t('contact.title')}
</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border border-charcoal/10 p-10 lg:p-14 bg-white/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>{t('contact.formName')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field }) => (
              <FormItem><FormLabel>{t('contact.formCompany')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>{t('contact.formEmail')}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>{t('contact.formPhone')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.formType')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {/* 다국어 placeholder 적용 */}
                    <SelectValue placeholder={t('contact.formTypePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="quick">{t('contact.types.quick')}</SelectItem>
                  <SelectItem value="mission">{t('contact.types.mission')}</SelectItem>
                  <SelectItem value="project">{t('contact.types.project')}</SelectItem>
                  <SelectItem value="rnd">{t('contact.types.rnd')}</SelectItem>
                  <SelectItem value="international">{t('contact.types.international')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.formMessage')}</FormLabel>
              <FormControl><Textarea className="h-32" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full bg-charcoal text-cream hover:bg-[#2a2622] font-serif">
            {t('contact.submitBtn')}
          </Button>
        </form>
      </Form>
    </section>
  );
}
