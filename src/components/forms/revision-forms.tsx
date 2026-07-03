"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRevisionRequest, addRevisionComment } from "@/lib/actions/revisions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/** Yeni revizyon isteği formu (giriş zorunlu sayfada kullanılır). */
export function NewRevisionRequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const result = await createRevisionRequest({ title, description });
    if (!result.success) {
      setStatus("idle");
      setErrorMessage(result.error);
      return;
    }
    setTitle("");
    setDescription("");
    setStatus("idle");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="revision-title" className="mb-1.5 block text-sm font-medium">
          Başlık
        </label>
        <Input
          id="revision-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Örn. Etkinlik sayfasına takvim görünümü eklensin"
          required
          minLength={5}
        />
      </div>
      <div>
        <label htmlFor="revision-description" className="mb-1.5 block text-sm font-medium">
          Açıklama
        </label>
        <Textarea
          id="revision-description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="İsteğini kısaca anlat: ne, neden, nasıl?"
          required
          minLength={10}
        />
      </div>
      {errorMessage && <p className="text-sm text-brand-error">{errorMessage}</p>}
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Gönderiliyor..." : "İstek Aç"}
      </Button>
    </form>
  );
}

/** İstek detayında yorum formu. */
export function RevisionCommentForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const result = await addRevisionComment({ requestId, body });
    if (!result.success) {
      setStatus("idle");
      setErrorMessage(result.error);
      return;
    }
    setBody("");
    setStatus("idle");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        aria-label="Yorumun"
        rows={3}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Yorumunu yaz..."
        required
        minLength={2}
      />
      {errorMessage && <p className="text-sm text-brand-error">{errorMessage}</p>}
      <Button type="submit" size="sm" disabled={status === "saving"}>
        {status === "saving" ? "Gönderiliyor..." : "Yorum Yap"}
      </Button>
    </form>
  );
}
