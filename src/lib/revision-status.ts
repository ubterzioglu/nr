export const revisionStatusLabels: Record<
  string,
  { label: string; variant: "default" | "secondary" }
> = {
  open: { label: "Açık", variant: "default" },
  planned: { label: "Planlandı", variant: "secondary" },
  done: { label: "Yapıldı", variant: "secondary" },
  rejected: { label: "Reddedildi", variant: "secondary" },
};
