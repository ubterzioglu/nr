-- =============================================================
-- 002_certificates.sql — Sertifika sistemi (B2.2)
-- İdempotent; Management API ile uygulanır.
-- =============================================================

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL UNIQUE REFERENCES event_registrations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_date DATE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pdf_path TEXT
);

CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates (code);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
-- policy yok → doğrulama sayfası server-side service role ile okur.
