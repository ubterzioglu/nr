import Link from "next/link";
import { Button } from "@/components/ui/button";

type EmptySectionProps = {
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptySection({ message, actionLabel, actionHref }: EmptySectionProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-8 py-12 text-center">
      <p className="text-muted-foreground">{message}</p>
      {actionLabel && actionHref && (
        <Button asChild variant="secondary" className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
