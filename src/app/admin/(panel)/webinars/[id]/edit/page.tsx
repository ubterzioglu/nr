import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/client";
import { WebinarForm } from "@/components/admin/webinar-form";

export const dynamic = "force-dynamic";

function splitTimestamp(value: string | null): { date: string; time: string } {
  if (!value) return { date: "", time: "" };
  const parsed = new Date(value);
  const date = parsed.toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
  const time = parsed.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  });
  return { date, time };
}

export default async function AdminEditWebinarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  if (!supabase) notFound();

  const { data: webinar } = await supabase
    .from("webinars")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!webinar) notFound();

  const { date, time } = splitTimestamp(webinar.webinar_date);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Webinarı Düzenle</h1>
      <WebinarForm
        initialValues={{
          id: webinar.id,
          title: webinar.title,
          slug: webinar.slug,
          description: webinar.description ?? "",
          speaker: webinar.speaker ?? "",
          webinarDate: date,
          webinarTime: time,
          capacity: webinar.capacity ? String(webinar.capacity) : "",
          meetingUrl: webinar.meeting_url ?? "",
          recordingUrl: webinar.recording_url ?? "",
          isFeatured: webinar.is_featured,
          isPublished: webinar.is_published,
          imageUrl: webinar.image_url,
        }}
      />
    </div>
  );
}
