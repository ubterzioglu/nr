"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { BlogPost } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const categories = [...new Set(posts.map((p) => p.category))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, query]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Yazılarda ara..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat} variant="secondary">{cat}</Badge>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">Sonuç bulunamadı.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{post.category}</Badge>
                  <CardTitle className="mt-2 group-hover:text-brand-primary">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>{post.readTime} okuma</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
