"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createFeedback, addFeedbackComment } from "@/lib/actions/feedback";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Yeni feedback formu (giriş zorunlu sayfada kullanılır). */
export function NewFeedbackForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setErrorMessage(null);
    if (!file) {
      setImagePreview(null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage("Yalnızca JPG, PNG veya WebP görsel yükleyebilirsiniz.");
      event.target.value = "";
      setImagePreview(null);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrorMessage("Görsel en fazla 5 MB olabilir.");
      event.target.value = "";
      setImagePreview(null);
      return;
    }
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await createFeedback(formData);
    if (!result.success) {
      setStatus("idle");
      setErrorMessage(result.error);
      return;
    }
    setTitle("");
    setDescription("");
    setImagePreview(null);
    formRef.current?.reset();
    setStatus("idle");
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="feedback-title" className="mb-1.5 block text-sm font-medium">
          Başlık
        </label>
        <Input
          id="feedback-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Örn. Etkinlik kayıt formunda bir sorun var"
          required
          minLength={5}
        />
      </div>
      <div>
        <label htmlFor="feedback-description" className="mb-1.5 block text-sm font-medium">
          Açıklama
        </label>
        <Textarea
          id="feedback-description"
          name="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Geri bildirimini kısaca anlat: ne, neden, nasıl?"
          required
          minLength={10}
        />
      </div>
      <div>
        <label htmlFor="feedback-image" className="mb-1.5 block text-sm font-medium">
          Görsel (opsiyonel, max 5 MB)
        </label>
        <input
          id="feedback-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-muted/80"
        />
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="Yüklenecek görsel önizlemesi"
            className="mt-3 h-32 w-auto rounded-lg border border-border object-cover"
          />
        )}
      </div>
      {errorMessage && <p className="text-sm text-brand-error">{errorMessage}</p>}
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Gönderiliyor..." : "Gönder"}
      </Button>
    </form>
  );
}

/** Feedback detayında yorum formu. */
export function FeedbackCommentForm({ feedbackId }: { feedbackId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const result = await addFeedbackComment({ feedbackId, body });
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
