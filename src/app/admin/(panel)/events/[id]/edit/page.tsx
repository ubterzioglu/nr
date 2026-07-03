import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { EventForm } from "@/components/admin/event-form";
import type { AdminEventFormData } from "@/lib/validations/admin";

export const dynamic = "force-dynamic";

export default async function AdminEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!event) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Etkinliği Düzenle</h1>
      <EventForm
        initialValues={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          description: event.description ?? "",
          eventType: (event.event_type as AdminEventFormData["eventType"]) ?? "workshop",
          status: event.status === "past" ? "past" : "upcoming",
          eventDate: event.event_date ?? "",
          eventTime: event.event_time?.slice(0, 5) ?? "",
          speaker: event.speaker ?? "",
          location: event.location ?? "",
          capacity: event.capacity ? String(event.capacity) : "",
          meetingUrl: event.meeting_url ?? "",
          registrationUrl: event.registration_url ?? "",
          isPublished: event.is_published,
          imageUrl: event.image_url,
        }}
      />
    </div>
  );
}
