import { announcements } from "@/config/site";

/** Duyuru yoksa bölüm gösterilmez */
export function Announcements() {
  const published = announcements.filter((a) => a.published);
  if (published.length === 0) return null;
  return null; // Admin'den duyuru eklendiğinde genişletilecek
}
