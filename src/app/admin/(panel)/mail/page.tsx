import { createServerClient } from "@/lib/supabase/client";
import { MailForm, type MailTargetOption } from "@/components/admin/mail-form";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminMailPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Mail Merkezi</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için mail merkezi kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const [{ data: events }, { data: webinars }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, event_date")
      .order("event_date", { ascending: false })
      .limit(50),
    supabase
      .from("webinars")
      .select("id, title, webinar_date")
      .order("webinar_date", { ascending: false })
      .limit(50),
  ]);

  const targets: MailTargetOption[] = [
    ...(events ?? []).map((event) => ({
      value: `event:${event.id}`,
      label: `[Etkinlik] ${event.title}`,
    })),
    ...(webinars ?? []).map((webinar) => ({
      value: `webinar:${webinar.id}`,
      label: `[Webinar] ${webinar.title}`,
    })),
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Mail Merkezi</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Etkinlik kayıtlılarına, katılanlara veya bülten abonelerine toplu mail
        gönderin. Gönderimler partiler hâlinde yapılır ve email_log&apos;a
        işlenir.
      </p>
      <MailForm targets={targets} />
    </div>
  );
}
