import { AdminDashboardStats } from "@/components/admin/admin-module-list";
import { adminCapabilities } from "@/config/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        NEXRISE admin paneli — içerik, başvuru ve topluluk yönetimi.
      </p>
      <AdminDashboardStats />
      <Card className="mt-8">
        <CardHeader><CardTitle>Admin Yetkileri</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {adminCapabilities.map((cap) => (
              <div key={cap.label} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm">
                <span>{cap.icon}</span>
                {cap.label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
