import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { adminUpdates, type AdminUpdateTag } from "@/config/admin-updates";

const tagVariants: Record<AdminUpdateTag, { label: string; className: string }> = {
  yeni: { label: "Yeni", className: "bg-brand-primary/10 text-brand-primary" },
  iyileştirme: { label: "İyileştirme", className: "bg-emerald-500/10 text-emerald-600" },
  duyuru: { label: "Duyuru", className: "bg-amber-500/10 text-amber-600" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminUpdatesPage() {
  const updates = [...adminUpdates].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Güncellemeler</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Yönetim paneline ve siteye eklenen yeni özellikler burada duyurulur.
      </p>

      <div className="space-y-4">
        {updates.map((update) => {
          const tag = tagVariants[update.tag];
          return (
            <Card key={`${update.date}-${update.title}`}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className={tag.className}>
                    {tag.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(update.date)}
                  </span>
                </div>
                <h2 className="mt-3 font-semibold">{update.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {update.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
