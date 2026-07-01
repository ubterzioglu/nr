import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { departments } from "@/config/site";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dept = departments.find((d) => d.slug === slug);
  if (!dept) return { title: "Başkanlık" };
  return pageMetadata({
    title: dept.title,
    description: dept.description,
    path: `/baskanliklar/${slug}`,
  });
}

export default async function BaskanlikDetailPage({ params }: Props) {
  const { slug } = await params;
  const dept = departments.find((d) => d.slug === slug);
  if (!dept) notFound();

  return (
    <>
      <PageHeader eyebrow="Başkanlık" title={dept.title} description={dept.description} />
      <section className="py-20">
        <Container className="max-w-3xl">
          <Button asChild variant="secondary" size="sm" className="mb-8">
            <Link href="/baskanliklar"><ArrowLeft className="h-4 w-4" /> Tüm Başkanlıklar</Link>
          </Button>

          <p className="text-lg leading-relaxed text-muted-foreground">{dept.longDescription}</p>

          <h2 className="mb-4 mt-12 text-xl font-semibold">Odak Alanları</h2>
          <div className="flex flex-wrap gap-3">
            {dept.highlights.map((item) => (
              <Badge key={item} variant="secondary" className="px-4 py-2">{item}</Badge>
            ))}
          </div>

          <h2 className="mb-4 mt-12 text-xl font-semibold">Sorumluluklar</h2>
          <ul className="space-y-2 text-muted-foreground">
            {dept.responsibilities.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-brand-primary">•</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-8">
            <p className="text-muted-foreground">
              {dept.title} bünyesine katılmak için başkanlık başvurusu yapabilirsiniz.
            </p>
            <Button asChild className="mt-6">
              <Link href="/basvurular">Başvuru Yap</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
