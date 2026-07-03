import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/config/site";
import { getBlogPostBySlug } from "@/lib/data/blogs";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

// Config'teki yazılar build'de üretilir; panelden eklenen DB yazıları
// ilk istekte render edilip ISR ile önbelleğe alınır (dynamicParams).
export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBlogPostBySlug(slug);
  if (!detail) return { title: "Blog" };
  return pageMetadata({
    title: detail.post.title,
    description: detail.post.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getBlogPostBySlug(slug);
  if (!detail) notFound();

  const { post, paragraphs } = detail;

  return (
    <>
      <PageHeader eyebrow={post.category} title={post.title} description={post.excerpt} />
      <section className="py-20">
        <Container className="max-w-3xl">
          <Button asChild variant="secondary" size="sm" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Tüm Yazılar
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {post.date && (
              <>
                <span>{new Date(post.date).toLocaleDateString("tr-TR")}</span>
                <span>•</span>
              </>
            )}
            {post.readTime && <span>{post.readTime} okuma</span>}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <article className="prose prose-slate dark:prose-invert mt-12 max-w-none">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="mb-6 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </article>
        </Container>
      </section>
    </>
  );
}
