-- =============================================================
-- 003_revisions_management.sql — Revizyon istekleri (B3.6) +
-- yönetim modülü temel tabloları (B3.7). İdempotent.
-- =============================================================

-- Üyelerin site/topluluk için revizyon istekleri; altına yorum yazılır.
CREATE TABLE IF NOT EXISTS revision_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'planned', 'done', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS revision_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES revision_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revision_comments_request
  ON revision_comments (request_id, created_at);
CREATE INDEX IF NOT EXISTS idx_revision_requests_created
  ON revision_requests (created_at DESC);

ALTER TABLE revision_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_comments ENABLE ROW LEVEL SECURITY;
-- policy yok → okuma/yazma server action'lardaki service role üzerinden
-- (üye girişi action içinde doğrulanır).

-- Yönetim modülü: görev dağılımı + toplantı/faaliyet notları (temel sürüm)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'done')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  meeting_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
-- policy yok → yalnızca service role (admin panel).
