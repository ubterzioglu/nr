import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { RevisionCommentForm } from "@/components/forms/revision-forms";
import { revisionStatusLabels } from "@/lib/revision-status";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Revizyon İsteği",
    description: "NEXRISE revizyon isteği detayı.",
    path: "/revizyon-istekleri",
  }),
  robots: { index: false, follow: false },
};

export default async function RevisionRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const [{ data: request }, { data: comments }] = await Promise.all([
    supabase.from("revision_requests").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("revision_comments")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!request) notFound();

  const status = revisionStatusLabels[request.status] ?? revisionStatusLabels.open;

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-3xl">
        <Button asChild variant="secondary" size="sm" className="mb-6">
          <Link href="/revizyon-istekleri">
            <ArrowLeft className="h-4 w-4" /> Tüm İstekler
          </Link>
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-bold">{request.title}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {request.author_name} ·{" "}
              {new Date(request.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {request.description}
            </p>
          </CardContent>
        </Card>

        <h2 className="mb-3 mt-8 text-lg font-semibold">
          Yorumlar ({comments?.length ?? 0})
        </h2>
        <div className="space-y-3">
          {(comments ?? []).map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.author_name}</span>
                  {comment.is_admin && (
                    <Badge variant="secondary" className="gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Yönetim
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {comment.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <RevisionCommentForm requestId={request.id} />
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
