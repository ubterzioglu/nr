import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminSession, type AdminSession } from "@/lib/admin/session";
import { sessionCanAccess, type AdminModule } from "@/lib/admin/permissions";
import { createServerClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

export type AdminActionResult = { success: true } | { success: false; error: string };

export type AdminContext = {
  supabase: SupabaseClient<Database>;
  session: AdminSession;
};

/**
 * Admin server action'larının ortak girişi: oturum + service-role client.
 * `module` verilirse rol matrisi de uygulanır (editor/moderator kısıtları).
 */
export async function requireAdminContext(module?: AdminModule): Promise<
  { ok: true; context: AdminContext } | { ok: false; error: string }
> {
  const session = await getAdminSession();
  if (!session) {
    return { ok: false, error: "Bu işlem için yönetici girişi gerekli." };
  }
  if (module && !sessionCanAccess(session, module)) {
    return { ok: false, error: "Bu modül için yetkiniz yok." };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Veritabanı yapılandırılmamış. Supabase ortam değişkenlerini tanımlayın.",
    };
  }

  return { ok: true, context: { supabase, session } };
}

/**
 * Admin işlem kaydı (audit log) — best effort: log hatası asıl işlemi
 * etkilemez. Hassas modüllerdeki (kullanıcı, ayar, silme) action'lardan
 * çağrılır.
 */
export async function logAdminAction(
  context: AdminContext,
  action: string,
  entity: string,
  entityId?: string | null,
  detail?: string
): Promise<void> {
  const adminLabel =
    context.session.kind === "supabase"
      ? (context.session.fullName ?? context.session.email)
      : context.session.kind === "legacy"
        ? "Ortak şifre (legacy)"
        : "Geliştirme modu";

  const { error } = await context.supabase.from("audit_log").insert({
    admin_label: adminLabel,
    action,
    entity,
    entity_id: entityId ?? null,
    detail: detail ?? null,
  });
  if (error) {
    console.error("[NEXRISE] audit_log yazılamadı:", error.message);
  }
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Görseli storage bucket'ına yükler ve public URL döner.
 * Yazma her zaman service role ile yapılır (bucket policy gerekmez).
 */
export async function uploadImage(
  supabase: SupabaseClient<Database>,
  bucket: "event-images" | "avatars",
  keyPrefix: string,
  file: File
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) {
    return { ok: false, error: "Yalnızca JPG, PNG veya WebP görsel yükleyebilirsiniz." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Görsel en fazla 4 MB olabilir." };
  }

  const path = `${keyPrefix}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    return { ok: false, error: `Görsel yüklenemedi: ${error.message}` };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
