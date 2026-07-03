import { Info } from "lucide-react";
import { LiveDashboardStats } from "@/components/admin/live-dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { adminGuideIntro, adminGuideModules } from "@/config/admin-guide";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        NEXRISE admin paneli — içerik, başvuru ve topluluk yönetimi.
      </p>

      {/* Genel bilgilendirme kartı */}
      <Card className="mb-8 border-brand-primary/20 bg-brand-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
            <div>
              <h2 className="font-semibold">{adminGuideIntro.title}</h2>
              {adminGuideIntro.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2 text-sm leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
              <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
                ⚠️ {adminGuideIntro.warning}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modül kullanım kılavuzu */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Panel Kullanım Kılavuzu</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {adminGuideModules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="text-left text-sm">
                  <span className="flex items-center gap-2.5">
                    <span>{module.icon}</span>
                    {module.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-1">
                    {module.steps.map((step) => (
                      <li
                        key={step}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary/60" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <LiveDashboardStats />
    </div>
  );
}
