import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { NewRevisionRequestForm } from "@/components/forms/revision-forms";
import { revisionStatusLabels } from "@/lib/revision-status";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Revizyon İstekleri",
    description: "NEXRISE topluluğu için geliştirme ve revizyon istekleri.",
    path: "/revizyon-istekleri",
  }),
  robots: { index: false, follow: false },
};

export default async function RevisionRequestsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const supabase = createServerClient();
  const [{ data: requests }, { data: comments }] = supabase
    ? await Promise.all([
        supabase
          .from("revision_requests")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("revision_comments").select("request_id"),
      ])
    : [{ data: [] }, { data: [] }];

  const commentCounts = new Map<string, number>();
  for (const comment of comments ?? []) {
    commentCounts.set(
      comment.request_id,
      (commentCounts.get(comment.request_id) ?? 0) + 1
    );
  }

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">Revizyon İstekleri</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Site ve topluluk için geliştirme önerilerini paylaş; yönetim
          değerlendirip durumunu günceller.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Yeni İstek Aç</CardTitle>
          </CardHeader>
          <CardContent>
            <NewRevisionRequestForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {(requests ?? []).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Henüz istek yok. İlk isteği sen aç!
            </p>
          ) : (
            (requests ?? []).map((request) => {
              const status =
                revisionStatusLabels[request.status] ?? revisionStatusLabels.open;
              return (
                <Link
                  key={request.id}
                  href={`/revizyon-istekleri/${request.id}`}
                  className="block"
                >
                  <Card className="transition-colors hover:border-brand-primary/40">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="font-semibold">{request.title}</h2>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {request.description}
                      </p>
                      <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{request.author_name}</span>
                        <span>
                          {new Date(request.created_at).toLocaleDateString("tr-TR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {commentCounts.get(request.id) ?? 0} yorum
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </Container>
    </section>
  );
}
