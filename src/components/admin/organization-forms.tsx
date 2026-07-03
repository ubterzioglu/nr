"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  saveBoardMember,
  saveDepartment,
  createTask,
  createMeeting,
  type DepartmentInput,
} from "@/lib/actions/admin/organization";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ---------------------------------------------------------------
// Yönetim kadrosu formu
// ---------------------------------------------------------------

export interface BoardMemberFormValues {
  id?: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  sortOrder: string;
  isActive: boolean;
  photoUrl: string | null;
}

export function BoardMemberForm({ initial }: { initial?: Partial<BoardMemberFormValues> }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initial?.photoUrl ?? null
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    formData.set("isActive", formData.get("isActive") === "on" ? "true" : "false");
    if (initial?.id) formData.set("id", initial.id);

    const result = await saveBoardMember(formData);
    if (!result.success) {
      setSaving(false);
      setErrorMessage(result.error);
      return;
    }
    router.push("/admin/board");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="member-name" className="mb-1.5 block text-sm font-medium">
                Ad Soyad *
              </label>
              <Input id="member-name" name="name" defaultValue={initial?.name ?? ""} required />
            </div>
            <div>
              <label htmlFor="member-role" className="mb-1.5 block text-sm font-medium">
                Görev *
              </label>
              <Input
                id="member-role"
                name="role"
                placeholder="Örn. Yönetim Kurulu Başkanı"
                defaultValue={initial?.role ?? ""}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="member-department" className="mb-1.5 block text-sm font-medium">
                Birim / Başkanlık
              </label>
              <Input
                id="member-department"
                name="department"
                defaultValue={initial?.department ?? ""}
              />
            </div>
            <div>
              <label htmlFor="member-order" className="mb-1.5 block text-sm font-medium">
                Sıralama
              </label>
              <Input
                id="member-order"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={initial?.sortOrder ?? "0"}
              />
            </div>
          </div>

          <div>
            <label htmlFor="member-bio" className="mb-1.5 block text-sm font-medium">
              Kısa Tanıtım
            </label>
            <Textarea id="member-bio" name="bio" rows={3} defaultValue={initial?.bio ?? ""} />
          </div>

          <div>
            <label htmlFor="member-photo" className="mb-1.5 block text-sm font-medium">
              Fotoğraf (JPG/PNG/WebP, en fazla 4 MB)
            </label>
            <input
              id="member-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setPhotoPreview(URL.createObjectURL(file));
              }}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-brand-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-primary"
            />
            {photoPreview && (
              <div className="relative mt-3 h-24 w-24 overflow-hidden rounded-full border border-border">
                <Image src={photoPreview} alt="Fotoğraf önizleme" fill unoptimized className="object-cover" />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial?.isActive ?? true}
              className="h-4 w-4 rounded border-border accent-brand-primary"
            />
            Sitede göster
          </label>

          {errorMessage && (
            <p role="alert" className="text-sm text-brand-error">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Kaydediliyor..." : isEdit ? "Değişiklikleri Kaydet" : "Üye Ekle"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/admin/board")}>
              Vazgeç
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------
// Başkanlık formu
// ---------------------------------------------------------------

export function DepartmentForm({ initial }: { initial?: Partial<DepartmentInput> }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [slug, setSlug] = useState(initial?.slug ?? "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await saveDepartment({
      id: initial?.id,
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      highlights: String(formData.get("highlights") ?? ""),
      icon: String(formData.get("icon") ?? ""),
      sortOrder: String(formData.get("sortOrder") ?? "0"),
      isActive: formData.get("isActive") === "on",
    });
    if (!result.success) {
      setSaving(false);
      setErrorMessage(result.error);
      return;
    }
    router.push("/admin/departments");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="dept-title" className="mb-1.5 block text-sm font-medium">
                Başlık *
              </label>
              <Input
                id="dept-title"
                name="title"
                defaultValue={initial?.title ?? ""}
                required
                onChange={(event) => {
                  if (!slugTouched) setSlug(slugify(event.target.value));
                }}
              />
            </div>
            <div>
              <label htmlFor="dept-slug" className="mb-1.5 block text-sm font-medium">
                Slug (URL) *
              </label>
              <Input
                id="dept-slug"
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="dept-description" className="mb-1.5 block text-sm font-medium">
              Açıklama
            </label>
            <Textarea
              id="dept-description"
              name="description"
              rows={3}
              defaultValue={initial?.description ?? ""}
            />
          </div>

          <div>
            <label htmlFor="dept-highlights" className="mb-1.5 block text-sm font-medium">
              Öne Çıkanlar (her satır bir madde)
            </label>
            <Textarea
              id="dept-highlights"
              name="highlights"
              rows={4}
              defaultValue={initial?.highlights ?? ""}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="dept-icon" className="mb-1.5 block text-sm font-medium">
                İkon (emoji)
              </label>
              <Input id="dept-icon" name="icon" placeholder="🚀" defaultValue={initial?.icon ?? ""} />
            </div>
            <div>
              <label htmlFor="dept-order" className="mb-1.5 block text-sm font-medium">
                Sıralama
              </label>
              <Input
                id="dept-order"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={initial?.sortOrder ?? "0"}
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial?.isActive ?? true}
              className="h-4 w-4 rounded border-border accent-brand-primary"
            />
            Sitede göster
          </label>

          {errorMessage && (
            <p role="alert" className="text-sm text-brand-error">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Kaydediliyor..." : isEdit ? "Değişiklikleri Kaydet" : "Başkanlık Ekle"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/admin/departments")}
            >
              Vazgeç
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------
// Görev ve toplantı hızlı ekleme formları
// ---------------------------------------------------------------

export function TaskQuickForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setErrorMessage(null);
    const formData = new FormData(form);
    const result = await createTask({
      title: String(formData.get("title") ?? ""),
      assignee: String(formData.get("assignee") ?? ""),
      department: String(formData.get("department") ?? ""),
      dueDate: String(formData.get("dueDate") ?? ""),
    });
    setSaving(false);
    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <Input name="title" placeholder="Görev başlığı *" required minLength={3} />
      <Input name="assignee" placeholder="Sorumlu" />
      <Input name="department" placeholder="Birim" />
      <Input name="dueDate" type="date" aria-label="Termin" />
      <Button type="submit" disabled={saving}>
        {saving ? "..." : "Ekle"}
      </Button>
      {errorMessage && (
        <p className="col-span-full text-sm text-brand-error">{errorMessage}</p>
      )}
    </form>
  );
}

export function MeetingQuickForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setErrorMessage(null);
    const formData = new FormData(form);
    const result = await createMeeting({
      title: String(formData.get("title") ?? ""),
      meetingDate: String(formData.get("meetingDate") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    });
    setSaving(false);
    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_auto]">
        <Input name="title" placeholder="Toplantı başlığı *" required minLength={3} />
        <Input name="meetingDate" type="date" aria-label="Toplantı tarihi" />
        <Button type="submit" disabled={saving}>
          {saving ? "..." : "Ekle"}
        </Button>
      </div>
      <Textarea name="notes" rows={2} placeholder="Toplantı notları / faaliyet özeti" />
      {errorMessage && <p className="text-sm text-brand-error">{errorMessage}</p>}
    </form>
  );
}
