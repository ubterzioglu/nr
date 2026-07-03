"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { sendBulkMail, type BulkMailInput } from "@/lib/actions/admin/mail";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface MailTargetOption {
  /** "event:{id}" | "webinar:{id}" */
  value: string;
  label: string;
}

const selectClassName =
  "flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm";

const templatePresets: Record<
  string,
  { subject: string; body: string } | undefined
> = {
  reminder: {
    subject: "Hatırlatma: Etkinliğimiz yaklaşıyor",
    body: "Merhaba,\n\nKayıt olduğunuz etkinlik yaklaşıyor. Katılım bilgileri kayıt onay mailinizde yer alıyor.\n\nGörüşmek üzere!\nNEXRISE Ekibi",
  },
  "thank-you": {
    subject: "Katılımınız için teşekkürler",
    body: "Merhaba,\n\nEtkinliğimize katıldığınız için teşekkür ederiz. Görüş ve önerilerinizi bizimle paylaşabilirsiniz.\n\nSevgiler,\nNEXRISE Ekibi",
  },
};

export function MailForm({ targets }: { targets: MailTargetOption[] }) {
  const [audience, setAudience] = useState<BulkMailInput["audience"]>("registered");
  const [target, setTarget] = useState(targets[0]?.value ?? "");
  const [template, setTemplate] = useState<BulkMailInput["template"]>("custom");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function applyTemplate(value: BulkMailInput["template"]) {
    setTemplate(value);
    const preset = templatePresets[value];
    if (preset) {
      setSubject(preset.subject);
      setBody(preset.body);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !window.confirm(
        "Seçili hedefteki TÜM alıcılara mail gönderilecek. Emin misiniz?"
      )
    ) {
      return;
    }

    setStatus("sending");
    setErrorMessage(null);
    const result = await sendBulkMail({
      audience,
      target: audience === "newsletter" ? undefined : target,
      template,
      subject,
      body,
    });
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }
    setStatus("success");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="mail-audience" className="mb-1.5 block text-sm font-medium">
                Hedef Kitle
              </label>
              <select
                id="mail-audience"
                className={selectClassName}
                value={audience}
                onChange={(event) =>
                  setAudience(event.target.value as BulkMailInput["audience"])
                }
              >
                <option value="registered">Etkinlik kayıtlıları</option>
                <option value="attended">Etkinliğe katılanlar</option>
                <option value="newsletter">Bülten aboneleri (tüm onaylı üyeler)</option>
              </select>
            </div>
            {audience !== "newsletter" && (
              <div>
                <label htmlFor="mail-target" className="mb-1.5 block text-sm font-medium">
                  Etkinlik / Webinar
                </label>
                <select
                  id="mail-target"
                  className={selectClassName}
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                >
                  {targets.length === 0 && <option value="">Etkinlik yok</option>}
                  {targets.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="mail-template" className="mb-1.5 block text-sm font-medium">
              Şablon
            </label>
            <select
              id="mail-template"
              className={selectClassName}
              value={template}
              onChange={(event) =>
                applyTemplate(event.target.value as BulkMailInput["template"])
              }
            >
              <option value="custom">Serbest içerik</option>
              <option value="reminder">Hatırlatma</option>
              <option value="thank-you">Etkinlik sonrası teşekkür</option>
              <option value="newsletter">Bülten</option>
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Hatırlatma ve teşekkür şablonları konu/içeriği doldurur; üzerinde
              değişiklik yapabilirsiniz.
            </p>
          </div>

          <div>
            <label htmlFor="mail-subject" className="mb-1.5 block text-sm font-medium">
              Konu
            </label>
            <Input
              id="mail-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              minLength={3}
            />
          </div>

          <div>
            <label htmlFor="mail-body" className="mb-1.5 block text-sm font-medium">
              İçerik
            </label>
            <Textarea
              id="mail-body"
              rows={10}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Düz metin yazın; boş satırlar paragraf olur."
              required
              minLength={10}
            />
          </div>

          {status === "error" && (
            <p role="alert" className="text-sm text-brand-error">
              {errorMessage}
            </p>
          )}
          {status === "success" && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm text-brand-success"
            >
              <CheckCircle2 className="h-4 w-4" />
              Gönderim tamamlandı. Ayrıntılar email_log kaydında.
            </p>
          )}

          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Gönderiliyor... (listeyi kapatmayın)" : "Toplu Mail Gönder"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
