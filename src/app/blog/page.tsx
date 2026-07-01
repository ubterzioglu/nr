import type { Metadata } from "next";
import { blogPosts } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { BlogList } from "@/components/blog/blog-list";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "NEXRISE blog — teknoloji, girişimcilik, kariyer ve ekosistem içerikleri.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="İçerikler & Güncellemeler"
        description="Teknoloji, girişimcilik ve NEXRISE ekosistemi hakkında yazılar."
      />
      <section className="py-20">
        <Container>
          <BlogList posts={blogPosts} />
        </Container>
      </section>
    </>
  );
}
