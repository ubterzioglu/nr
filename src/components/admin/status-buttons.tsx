"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  updateApplicationStatus,
  type ApplicationStatus,
} from "@/lib/actions/admin/inbox";

/** Başvuru durumunu onay penceresi olmadan tek tıkla günceller. */
export function ApplicationStatusButtons({
  id,
  current,
}: {
  id: string;
  current: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setStatus(status: ApplicationStatus) {
    startTransition(async () => {
      const result = await updateApplicationStatus(id, status);
      if (!result.success) {
        window.alert(result.error ?? "İşlem başarısız oldu.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {current !== "approved" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => setStatus("approved")}
        >
          Onayla
        </Button>
      )}
      {current !== "rejected" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          className="text-brand-error hover:bg-brand-error/10"
          onClick={() => setStatus("rejected")}
        >
          Reddet
        </Button>
      )}
      {current !== "pending" && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => setStatus("pending")}
        >
          Beklet
        </Button>
      )}
    </div>
  );
}
