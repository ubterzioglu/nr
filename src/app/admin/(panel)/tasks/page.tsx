import { createServerClient } from "@/lib/supabase/client";
import {
  deleteTask,
  deleteMeeting,
  setTaskStatus,
} from "@/lib/actions/admin/organization";
import {
  TaskQuickForm,
  MeetingQuickForm,
} from "@/components/admin/organization-forms";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/types/database";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type MeetingRow = Database["public"]["Tables"]["meetings"]["Row"];

export const dynamic = "force-dynamic";

const taskStatusLabels: Record<string, { label: string; variant: "default" | "secondary" }> = {
  open: { label: "Açık", variant: "default" },
  in_progress: { label: "Devam Ediyor", variant: "secondary" },
  done: { label: "Tamamlandı", variant: "secondary" },
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const taskColumns: DataTableColumn<TaskRow>[] = [
  { key: "title", label: "Görev", render: (row) => <span className="font-medium">{row.title}</span> },
  { key: "assignee", label: "Sorumlu", render: (row) => row.assignee ?? "—" },
  { key: "department", label: "Birim", render: (row) => row.department ?? "—" },
  { key: "due_date", label: "Termin", render: (row) => formatDate(row.due_date) },
  {
    key: "status",
    label: "Durum",
    render: (row) => {
      const status = taskStatusLabels[row.status] ?? taskStatusLabels.open;
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];

const meetingColumns: DataTableColumn<MeetingRow>[] = [
  { key: "title", label: "Toplantı", render: (row) => <span className="font-medium">{row.title}</span> },
  { key: "meeting_date", label: "Tarih", render: (row) => formatDate(row.meeting_date) },
  {
    key: "notes",
    label: "Notlar",
    className: "max-w-md",
    render: (row) => (
      <span className="line-clamp-2 text-muted-foreground">{row.notes ?? "—"}</span>
    ),
  },
];

export default async function AdminTasksPage() {
  const supabase = createServerClient();

  if (!supabase) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Görevler & Toplantılar</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Supabase yapılandırılmadığı için yönetim modülü kullanılamıyor.
          </CardContent>
        </Card>
      </div>
    );
  }

  const [{ data: tasks }, { data: meetings }] = await Promise.all([
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("meetings").select("*").order("meeting_date", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Görevler & Toplantılar</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Yönetim kurulu görev dağılımı ve haftalık toplantı/faaliyet notları
        (content.pdf §33 temel sürüm).
      </p>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Yeni Görev</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskQuickForm />
        </CardContent>
      </Card>

      <DataTable
        columns={taskColumns}
        rows={tasks ?? []}
        summary={`${tasks?.length ?? 0} görev`}
        emptyMessage="Henüz görev yok."
        actions={(row) => (
          <>
            {row.status !== "done" && (
              <ConfirmButton
                message={`"${row.title}" tamamlandı olarak işaretlensin mi?`}
                action={setTaskStatus.bind(null, row.id, "done")}
                variant="outline"
                destructive={false}
              >
                Tamamla
              </ConfirmButton>
            )}
            {row.status === "open" && (
              <ConfirmButton
                message={`"${row.title}" devam ediyor olarak işaretlensin mi?`}
                action={setTaskStatus.bind(null, row.id, "in_progress")}
                variant="ghost"
                destructive={false}
              >
                Başlat
              </ConfirmButton>
            )}
            <ConfirmButton
              message={`"${row.title}" görevi silinsin mi?`}
              action={deleteTask.bind(null, row.id)}
            >
              Sil
            </ConfirmButton>
          </>
        )}
      />

      <Card className="mb-4 mt-10">
        <CardHeader>
          <CardTitle className="text-base">Yeni Toplantı / Faaliyet Notu</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingQuickForm />
        </CardContent>
      </Card>

      <DataTable
        columns={meetingColumns}
        rows={meetings ?? []}
        summary={`${meetings?.length ?? 0} toplantı`}
        emptyMessage="Henüz toplantı kaydı yok."
        actions={(row) => (
          <ConfirmButton
            message={`"${row.title}" toplantı kaydı silinsin mi?`}
            action={deleteMeeting.bind(null, row.id)}
          >
            Sil
          </ConfirmButton>
        )}
      />
    </div>
  );
}
