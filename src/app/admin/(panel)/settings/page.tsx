import { brand } from "@/config/site";
import { adminCapabilities } from "@/config/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Site Ayarları</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle>Genel Bilgiler</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium">Marka:</span> {brand.name}</p>
          <p><span className="font-medium">Ana Slogan:</span> {brand.slogan}</p>
          <p><span className="font-medium">Tagline:</span> {brand.tagline}</p>
          <p><span className="font-medium">İletişim:</span> {brand.contactNote}</p>
          <p><span className="font-medium">SEO:</span> {brand.seoDescription}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Admin Panel Modülleri</CardTitle></CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
            {adminCapabilities.map((cap) => (
              <li key={cap.label} className="flex gap-2">
                <span>{cap.icon}</span>
                {cap.label}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
