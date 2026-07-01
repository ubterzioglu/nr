import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

/** ~35% larger than previous sizes; şeffaf PNG kullanır */
const sizes = {
  sm: "h-11 w-auto",
  md: "h-14 w-auto",
  lg: "h-[5.5rem] w-auto md:h-28",
  xl: "h-[6.5rem] w-auto md:h-[7.5rem] lg:h-32",
};

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <Image
      src="/logo-transparent.png"
      alt="NEXRISE — Rise of the Next Generation"
      width={280}
      height={94}
      className={cn(sizes[size], className)}
      priority
    />
  );
}
