import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { FeedbackCommentForm } from "@/components/forms/feedback-forms";
import { feedbackStatusLabels } from "@/lib/feedback-status";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Geri Bildirim Detayı",
    description: "NEXRISE geri bildirim detayı.",
    path: "/geri-bildirim",
  }),
  robots: { index: false, follow: false },
};

export default async function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const [{ data: item }, { data: comments }] = await Promise.all([
    supabase.from("feedback").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("feedback_comments")
      .select("*")
      .eq("feedback_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!item) notFound();

  const status = feedbackStatusLabels[item.status] ?? feedbackStatusLabels.open;

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-3xl">
        <Button asChild variant="secondary" size="sm" className="mb-6">
          <Link href="/geri-bildirim">
            <ArrowLeft className="h-4 w-4" /> Tüm Geri Bildirimler
          </Link>
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-bold">{item.title}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {item.author_name} ·{" "}
              {new Date(item.created_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            {item.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image_url}
                alt="Geri bildirim eki"
                className="mt-4 max-h-96 w-auto rounded-lg border border-border object-contain"
              />
            )}
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
            <FeedbackCommentForm feedbackId={item.id} />
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
