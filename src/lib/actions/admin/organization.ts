"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  requireAdminContext,
  uploadImage,
  type AdminActionResult,
} from "@/lib/actions/admin/shared";
import { slugify } from "@/lib/utils";

// ---------------------------------------------------------------
// Yönetim kadrosu (board_members)
// ---------------------------------------------------------------

const boardMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  role: z.string().min(2, "Görev en az 2 karakter olmalıdır"),
  department: z.string().optional(),
  bio: z.string().optional(),
  sortOrder: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), "Sıralama sayı olmalıdır"),
  isActive: z.boolean(),
});

function revalidateOrganizationPages() {
  revalidatePath("/yonetim");
  revalidatePath("/baskanliklar");
  revalidatePath("/admin/board");
  revalidatePath("/admin/departments");
}

export async function saveBoardMember(formData: FormData): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = boardMemberSchema.safeParse({
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    department: String(formData.get("department") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    sortOrder: formData.get("sortOrder") ? String(formData.get("sortOrder")) : undefined,
    isActive: formData.get("isActive") === "true",
  });
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  let photoUrl: string | undefined;
  const photoFile = formData.get("photo");
  if (photoFile instanceof File && photoFile.size > 0) {
    const upload = await uploadImage(
      supabase,
      "avatars",
      `board/${slugify(data.name)}`,
      photoFile
    );
    if (!upload.ok) return { success: false, error: upload.error };
    photoUrl = upload.url;
  }

  const row = {
    name: data.name,
    role: data.role,
    department: data.department || null,
    bio: data.bio || null,
    sort_order: data.sortOrder ? Number(data.sortOrder) : 0,
    is_active: data.isActive,
    updated_at: new Date().toISOString(),
    ...(photoUrl ? { photo_url: photoUrl } : {}),
  };

  const result = data.id
    ? await supabase.from("board_members").update(row).eq("id", data.id)
    : await supabase.from("board_members").insert(row);

  if (result.error) return { success: false, error: result.error.message };

  revalidateOrganizationPages();
  return { success: true };
}

export async function deleteBoardMember(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("board_members")
    .delete()
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateOrganizationPages();
  return { success: true };
}

// ---------------------------------------------------------------
// Başkanlıklar (departments)
// ---------------------------------------------------------------

const departmentSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Yalnızca küçük harf, rakam ve tire kullanın"),
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  description: z.string().optional(),
  /** Satır başına bir madde. */
  highlights: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), "Sıralama sayı olmalıdır"),
  isActive: z.boolean(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;

export async function saveDepartment(input: DepartmentInput): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };
  const { supabase } = guard.context;

  const parsed = departmentSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz form verisi." };
  }
  const data = parsed.data;

  const highlights = (data.highlights ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const row = {
    slug: data.slug,
    title: data.title,
    description: data.description || null,
    highlights,
    icon: data.icon || null,
    sort_order: data.sortOrder ? Number(data.sortOrder) : 0,
    is_active: data.isActive,
    updated_at: new Date().toISOString(),
  };

  const result = data.id
    ? await supabase.from("departments").update(row).eq("id", data.id)
    : await supabase.from("departments").insert(row);

  if (result.error) {
    if (result.error.code === "23505") {
      return { success: false, error: "Bu slug ile bir başkanlık zaten var." };
    }
    return { success: false, error: result.error.message };
  }

  revalidateOrganizationPages();
  return { success: true };
}

export async function deleteDepartment(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("departments")
    .delete()
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateOrganizationPages();
  return { success: true };
}

// ---------------------------------------------------------------
// Görevler + toplantılar (yönetim modülü temel sürüm)
// ---------------------------------------------------------------

const taskSchema = z.object({
  title: z.string().min(3, "Görev başlığı en az 3 karakter olmalıdır"),
  assignee: z.string().optional(),
  department: z.string().optional(),
  dueDate: z.string().optional(),
});

export async function createTask(input: z.infer<typeof taskSchema>): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz görev." };
  }

  const { error } = await guard.context.supabase.from("tasks").insert({
    title: parsed.data.title,
    assignee: parsed.data.assignee || null,
    department: parsed.data.department || null,
    due_date: parsed.data.dueDate || null,
  });
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function setTaskStatus(
  id: string,
  status: "open" | "in_progress" | "done"
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase
    .from("tasks")
    .update({ status })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function deleteTask(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase.from("tasks").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tasks");
  return { success: true };
}

const meetingSchema = z.object({
  title: z.string().min(3, "Toplantı başlığı en az 3 karakter olmalıdır"),
  meetingDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function createMeeting(
  input: z.infer<typeof meetingSchema>
): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const parsed = meetingSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { success: false, error: firstIssue?.message ?? "Geçersiz toplantı." };
  }

  const { error } = await guard.context.supabase.from("meetings").insert({
    title: parsed.data.title,
    meeting_date: parsed.data.meetingDate || null,
    notes: parsed.data.notes || null,
  });
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tasks");
  return { success: true };
}

export async function deleteMeeting(id: string): Promise<AdminActionResult> {
  const guard = await requireAdminContext("content");
  if (!guard.ok) return { success: false, error: guard.error };

  const { error } = await guard.context.supabase.from("meetings").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/tasks");
  return { success: true };
}
