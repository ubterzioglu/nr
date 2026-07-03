import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { brand } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Card } from "@/components/ui/card";

interface AuthSplitCardProps {
  badge?: string;
  title: string;
  description: string;
  features?: string[];
  children: React.ReactNode;
}

/**
 * Çift sütunlu giriş kartı: solda marka içeriği, sağda form.
 * Admin girişi ve üye girişi ekranları tarafından paylaşılır.
 */
export function AuthSplitCard({
  badge,
  title,
  description,
  features = [],
  children,
}: AuthSplitCardProps) {
  return (
    <section className="flex min-h-screen items-center bg-muted/30 py-28">
      <Container className="mx-auto w-full max-w-4xl">
        <Card className="grid overflow-hidden rounded-3xl shadow-xl md:grid-cols-2">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-dark p-10 text-white md:flex">
            <Image
              src="/videos/hero-abstract-poster.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 768px) 28rem, 0px"
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-dark/30 to-brand-dark/90" />

            <div className="relative">
              <Logo size="md" />
            </div>

            <div className="relative">
              {badge && (
                <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-accent">
                  {badge}
                </span>
              )}
              <h1 className="text-2xl font-bold leading-tight tracking-tight">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {description}
              </p>
              {features.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-slate-200"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="relative text-xs text-slate-400">
              © {new Date().getFullYear()} {brand.name} — {brand.slogan}
            </p>
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="mb-8 md:hidden">
              <Logo size="sm" />
            </div>
            {children}
          </div>
        </Card>
      </Container>
    </section>
  );
}
