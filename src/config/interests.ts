/** Üye profilindeki ilgi alanı seçenekleri (content.pdf §30). */
export const interestOptions = [
  "Yapay Zekâ",
  "Yazılım",
  "Siber Güvenlik",
  "Fintech",
  "Girişimcilik",
  "Veri Bilimi",
  "Kariyer",
  "Tasarım",
] as const;

export type Interest = (typeof interestOptions)[number];
