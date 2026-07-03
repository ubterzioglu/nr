import { EventForm } from "@/components/admin/event-form";

export default function AdminNewEventPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Yeni Etkinlik</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Etkinlik önce taslak olarak kaydedilir; &quot;Sitede yayınla&quot;
        işaretlenmedikçe sitede görünmez.
      </p>
      <EventForm />
    </div>
  );
}
