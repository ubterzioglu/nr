-- =============================================================
-- 001_platform_foundation.sql — Platform temeli (B0.1)
-- Üyelik + etkinlik kayıt + mail log altyapısı.
-- İdempotent yazılmıştır; Management API ile tekrar uygulanabilir.
-- schema.sql başlangıç şemasıdır; bu dosya ve sonrakiler onu evriltir.
-- =============================================================

-- -------------------------------------------------------------
-- 1) Admin yetki ekseni (topluluk rolünden bağımsız — content.pdf §1)
-- -------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'editor', 'moderator');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -------------------------------------------------------------
-- 2) events / webinars: görsel, kontenjan, katılım linki
--    meeting_url PUBLIC OKUMAYA KAPALIDIR (aşağıda view ile çözülür)
-- -------------------------------------------------------------
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS capacity INT,
  ADD COLUMN IF NOT EXISTS meeting_url TEXT;

ALTER TABLE webinars
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS capacity INT,
  ADD COLUMN IF NOT EXISTS meeting_url TEXT;

-- -------------------------------------------------------------
-- 3) users: profil + yönetim alanları (content.pdf §2, D2/D3)
-- -------------------------------------------------------------
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS admin_role admin_role,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS university TEXT,
  ADD COLUMN IF NOT EXISTS high_school TEXT,
  ADD COLUMN IF NOT EXISTS profession TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS kvkk_consent_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_username
  ON users (lower(username)) WHERE username IS NOT NULL;

-- Girişli kullanıcı yalnızca KENDİ profil satırını okuyabilir
-- (yazma her zaman server action + service role üzerinden).
DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" ON users
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- -------------------------------------------------------------
-- 4) sponsors: açıklama (content.pdf §15)
-- -------------------------------------------------------------
ALTER TABLE sponsors ADD COLUMN IF NOT EXISTS description TEXT;

-- KVKK açık rıza zaman damgası (PII toplayan mevcut formlar)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS kvkk_consent_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS kvkk_consent_at TIMESTAMPTZ;

-- -------------------------------------------------------------
-- 5) event_registrations — asıl kayıt tablosu
--    (applications tablosuna type='event' yazma dönemi kapanıyor)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled')),
  attended BOOLEAN,
  kvkk_consent_at TIMESTAMPTZ,
  cancel_token UUID NOT NULL DEFAULT gen_random_uuid(),
  reminder_1d_sent_at TIMESTAMPTZ,
  reminder_1h_sent_at TIMESTAMPTZ,
  reminder_15m_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- kayıt ya bir etkinliğe ya bir webinara bağlıdır (tam olarak biri)
  CHECK ((event_id IS NOT NULL)::int + (webinar_id IS NOT NULL)::int = 1)
);

-- Aktif kayıtlar için çift kayıt engeli (iptal sonrası yeniden kayıt serbest)
CREATE UNIQUE INDEX IF NOT EXISTS uq_event_reg_event_email
  ON event_registrations (event_id, lower(email))
  WHERE event_id IS NOT NULL AND status = 'registered';
CREATE UNIQUE INDEX IF NOT EXISTS uq_event_reg_webinar_email
  ON event_registrations (webinar_id, lower(email))
  WHERE webinar_id IS NOT NULL AND status = 'registered';
CREATE UNIQUE INDEX IF NOT EXISTS uq_event_reg_cancel_token
  ON event_registrations (cancel_token);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_webinar ON event_registrations (webinar_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_user ON event_registrations (user_id);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
-- policy yok → yalnızca service role erişir (PII)

-- -------------------------------------------------------------
-- 6) email_log — tüm kullanıcı maillerinin izi (batch + retry temeli)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  template TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error TEXT,
  related_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  related_webinar_id UUID REFERENCES webinars(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_log_created ON email_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_log_status ON email_log (status);

ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
-- policy yok → yalnızca service role

-- -------------------------------------------------------------
-- 7) roles seed (MASTER.md rol hiyerarşisi)
-- -------------------------------------------------------------
INSERT INTO roles (name, label) VALUES
  ('visitor', 'Ziyaretçi'),
  ('member', 'Üye'),
  ('volunteer', 'Gönüllü'),
  ('president', 'Başkan'),
  ('vice_president', 'Başkan Yardımcısı'),
  ('board_chair', 'YK Başkanı'),
  ('admin', 'Admin')
ON CONFLICT (name) DO NOTHING;

-- -------------------------------------------------------------
-- 8) auth.users → public.users trigger'ı (üyelik açılışı)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    (SELECT id FROM public.roles WHERE name = 'member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------
-- 9) Public okuma view'ları — meeting_url sızıntı önlemi
--    View'lar owner (postgres) yetkisiyle çalışır (security definer
--    semantiği BİLİNÇLİDİR): base tabloda anon policy kalmaz,
--    anon yalnızca bu view'lardan yayınlanmış satırları okur.
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW events_public AS
  SELECT id, slug, title, description, event_type, status, event_date, event_time,
         speaker, location, registration_url, image_url, capacity, is_published,
         created_at, updated_at
  FROM events
  WHERE is_published = true;

CREATE OR REPLACE VIEW webinars_public AS
  SELECT id, event_id, slug, title, description, speaker, webinar_date, recording_url,
         image_url, capacity, is_featured, is_published, created_at, updated_at
  FROM webinars
  WHERE is_published = true;

GRANT SELECT ON events_public TO anon, authenticated;
GRANT SELECT ON webinars_public TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_events" ON events;
DROP POLICY IF EXISTS "public_read_webinars" ON webinars;

-- -------------------------------------------------------------
-- 10) Storage bucket'ları (yazma her zaman server action + service
--     role üzerinden yapılır; storage.objects policy'si gerekmez)
-- -------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES
  ('event-images', 'event-images', true),
  ('avatars', 'avatars', true),
  ('certificates', 'certificates', false),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;
