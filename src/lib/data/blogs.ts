import { createBrowserClient, createServerClient } from "@/lib/supabase/client";
import { blogPosts as fallbackPosts } from "@/config/site";
import { blogArticleBodies } from "@/config/content";
import type { BlogPost } from "@/types";
import type { Database } from "@/types/database";

type BlogRow = Database["public"]["Tables"]["blogs"]["Row"];

function mapBlogRow(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "Blog",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    date: row.published_at?.slice(0, 10) ?? "",
    readTime: row.read_time ?? "",
  };
}

/**
 * Yayınlanmış blog/haber/duyuru yazıları.
 * NOT: events'ten farklı olarak boş DB sonucunda da config'e düşer —
 * el kitabından gelen mevcut yazılar, panelden ilk içerik girilene kadar
 * sitede kalmaya devam eder.
 */
export async function getPublishedBlogPosts(limit = 50): Promise<BlogPost[]> {
  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return fallbackPosts;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[NEXRISE] blog sorgusu başarısız:", error.message);
    return fallbackPosts;
  }

  if (!data || data.length === 0) return fallbackPosts;
  return data.map(mapBlogRow);
}

export type BlogPostDetail = {
  post: BlogPost;
  paragraphs: string[];
};

/** Slug ile tek yazı — önce DB, yoksa config + blogArticleBodies. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const fromConfig = (): BlogPostDetail | null => {
    const post = fallbackPosts.find((candidate) => candidate.slug === slug);
    if (!post) return null;
    return { post, paragraphs: blogArticleBodies[slug] ?? [post.excerpt] };
  };

  const supabase = createServerClient() ?? createBrowserClient();
  if (!supabase) return fromConfig();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[NEXRISE] blog detay sorgusu başarısız:", error.message);
    return fromConfig();
  }

  if (data) {
    const paragraphs = (data.content ?? data.excerpt ?? "")
      .split(/\r?\n\s*\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    return { post: mapBlogRow(data), paragraphs };
  }
  return fromConfig();
}
