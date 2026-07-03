"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setUserAdminRole,
  setUserCommunityRole,
} from "@/lib/actions/admin/users";
import type { AdminRole, UserRole } from "@/types/database";

const communityRoleOptions: { value: UserRole; label: string }[] = [
  { value: "member", label: "Üye" },
  { value: "volunteer", label: "Gönüllü" },
  { value: "president", label: "Başkan" },
  { value: "vice_president", label: "Başkan Yardımcısı" },
  { value: "board_chair", label: "YK Başkanı" },
  { value: "admin", label: "Admin" },
  { value: "visitor", label: "Ziyaretçi" },
];

const adminRoleOptions: { value: AdminRole | ""; label: string }[] = [
  { value: "", label: "Panel yetkisi yok" },
  { value: "super_admin", label: "Süper Admin" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editör" },
  { value: "moderator", label: "Moderatör" },
];

const selectClassName =
  "h-9 rounded-lg border border-border bg-background px-2 text-xs";

interface UserRoleControlsProps {
  userId: string;
  communityRole: UserRole | null;
  adminRole: AdminRole | null;
  /** Panel yetkisi atamayı yalnız süper admin görür. */
  canAssignAdminRole: boolean;
}

export function UserRoleControls({
  userId,
  communityRole,
  adminRole,
  canAssignAdminRole,
}: UserRoleControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        window.alert(result.error ?? "İşlem başarısız oldu.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <select
        aria-label="Topluluk rolü"
        className={selectClassName}
        value={communityRole ?? "member"}
        disabled={isPending}
        onChange={(event) =>
          run(() => setUserCommunityRole(userId, event.target.value as UserRole))
        }
      >
        {communityRoleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {canAssignAdminRole && (
        <select
          aria-label="Panel yetkisi"
          className={selectClassName}
          value={adminRole ?? ""}
          disabled={isPending}
          onChange={(event) =>
            run(() => setUserAdminRole(userId, event.target.value as AdminRole | ""))
          }
        >
          {adminRoleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
