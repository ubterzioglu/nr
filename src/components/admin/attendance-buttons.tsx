"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAttendance } from "@/lib/actions/admin/registrations";

interface AttendanceButtonsProps {
  registrationId: string;
  targetType: "event" | "webinar";
  targetId: string;
  attended: boolean | null;
}

/** Katıldı / Katılmadı / Sıfırla yoklama düğmeleri. */
export function AttendanceButtons({
  registrationId,
  targetType,
  targetId,
  attended,
}: AttendanceButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function update(value: boolean | null) {
    startTransition(async () => {
      const result = await markAttendance(registrationId, targetType, targetId, value);
      if (!result.success) {
        window.alert(result.error ?? "İşlem başarısız oldu.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1">
      {attended !== true && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          title="Katıldı olarak işaretle"
          disabled={isPending}
          onClick={() => update(true)}
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
      {attended !== false && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          title="Katılmadı olarak işaretle"
          disabled={isPending}
          className="text-brand-error hover:bg-brand-error/10"
          onClick={() => update(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {attended !== null && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          title="İşareti kaldır"
          disabled={isPending}
          onClick={() => update(null)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
