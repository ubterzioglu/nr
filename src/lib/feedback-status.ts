export const feedbackStatusLabels: Record<
  string,
  { label: string; variant: "default" | "secondary" }
> = {
  open: { label: "Açık", variant: "default" },
  reviewing: { label: "İncelemede", variant: "secondary" },
  resolved: { label: "Çözüldü", variant: "secondary" },
  rejected: { label: "Reddedildi", variant: "secondary" },
};
