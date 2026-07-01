import { SocialBrandLogo, socialBrandStyles, type SocialPlatform } from "@/components/shared/social-icons";
import { cn } from "@/lib/utils";

type SocialLinkCardProps = {
  href: string;
  label: string;
  subtitle?: string;
  icon: SocialPlatform;
  className?: string;
  size?: "md" | "lg";
};

export function SocialLinkCard({
  href,
  label,
  subtitle = "Resmî kanal",
  icon,
  className,
  size = "md",
}: SocialLinkCardProps) {
  const logoSize = size === "lg" ? "h-10 w-10" : "h-9 w-9";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-brand-primary/40 hover:shadow-md",
        className
      )}
    >
      <div className={cn("rounded-xl p-3", socialBrandStyles[icon])}>
        <SocialBrandLogo icon={icon} className={logoSize} uid={label} />
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{label}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </a>
  );
}
