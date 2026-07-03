-- NEXRISE Row Level Security politikaları
-- Yazma işlemleri server action'lardaki service role üzerinden yapılır (RLS'i bypass eder).
-- Anon key yalnızca yayınlanmış/aktif içeriği okuyabilir; PII tabloları tamamen kapalıdır.

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_inquiries ENABLE ROW LEVEL SECURITY;

-- Herkese açık okunabilir içerik
-- NOT (001_platform_foundation.sql): events/webinars için doğrudan public
-- policy KALDIRILDI — meeting_url sızıntısını önlemek için anon okuma
-- events_public / webinars_public VIEW'ları üzerinden yapılır.

CREATE POLICY "public_read_blogs" ON blogs
  FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_announcements" ON announcements
  FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_departments" ON departments
  FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_board_members" ON board_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_sponsors" ON sponsors
  FOR SELECT USING (is_active = true);

-- users, roles, applications, contacts, settings, sponsor_inquiries,
-- event_registrations, email_log:
-- public politika yok — yalnızca service role erişebilir.
-- İstisna (001_platform_foundation.sql): girişli kullanıcı kendi users
-- satırını okuyabilir ("users_select_own" — auth.uid() = id).
