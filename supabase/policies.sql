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
CREATE POLICY "public_read_events" ON events
  FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_webinars" ON webinars
  FOR SELECT USING (is_published = true);

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

-- users, roles, applications, contacts, settings, sponsor_inquiries:
-- public politika yok — yalnızca service role erişebilir.
