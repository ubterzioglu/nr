import { WebinarForm } from "@/components/admin/webinar-form";

export default function AdminNewWebinarPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Yeni Webinar</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Webinar önce taslak olarak kaydedilir; &quot;Sitede yayınla&quot;
        işaretlenmedikçe sitede görünmez.
      </p>
      <WebinarForm />
    </div>
  );
}
