import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/data/blogs";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Container } from "@/components/shared/container";
import { BlogList } from "@/components/blog/blog-list";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "NEXRISE blog — teknoloji, girişimcilik, kariyer ve ekosistem içerikleri.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="İçerikler & Güncellemeler"
        description="Teknoloji, girişimcilik ve NEXRISE ekosistemi hakkında yazılar."
      />
      <section className="py-20">
        <Container>
          <BlogList posts={posts} />
        </Container>
      </section>
    </>
  );
}
