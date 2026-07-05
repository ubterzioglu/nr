import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/server";
import { createServerClient } from "@/lib/supabase/client";
import { NewFeedbackForm } from "@/components/forms/feedback-forms";
import { feedbackStatusLabels } from "@/lib/feedback-status";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Geri Bildirim",
    description: "NEXRISE platformu için geri bildirimlerini paylaş.",
    path: "/geri-bildirim",
  }),
  robots: { index: false, follow: false },
};

export default async function FeedbackPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/giris");

  const supabase = createServerClient();
  const [{ data: items }, { data: comments }] = supabase
    ? await Promise.all([
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
        supabase.from("feedback_comments").select("feedback_id"),
      ])
    : [{ data: [] }, { data: [] }];

  const commentCounts = new Map<string, number>();
  for (const comment of comments ?? []) {
    commentCounts.set(
      comment.feedback_id,
      (commentCounts.get(comment.feedback_id) ?? 0) + 1
    );
  }

  return (
    <section className="min-h-screen bg-muted/30 pb-20 pt-28">
      <Container className="max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold">Geri Bildirim</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Site ve platformla ilgili görüş, öneri veya hata bildirimini
          paylaş; yönetim değerlendirip durumunu günceller.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Yeni Geri Bildirim Gönder</CardTitle>
          </CardHeader>
          <CardContent>
            <NewFeedbackForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {(items ?? []).length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Henüz geri bildirim yok. İlkini sen gönder!
            </p>
          ) : (
            (items ?? []).map((item) => {
              const status = feedbackStatusLabels[item.status] ?? feedbackStatusLabels.open;
              return (
                <Link key={item.id} href={`/geri-bildirim/${item.id}`} className="block">
                  <Card className="transition-colors hover:border-brand-primary/40">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="font-semibold">{item.title}</h2>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{item.author_name}</span>
                        <span>{new Date(item.created_at).toLocaleDateString("tr-TR")}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {commentCounts.get(item.id) ?? 0} yorum
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
