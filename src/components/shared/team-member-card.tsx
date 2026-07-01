import Image from "next/image";
import type { TeamMember } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TeamMemberCardProps = {
  member: TeamMember;
  featured?: boolean;
};

export function TeamMemberCard({ member, featured = false }: TeamMemberCardProps) {
  if (featured && member.image) {
    return (
      <Card className="overflow-hidden border-border/60 lg:col-span-3">
        <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
          <div className="relative aspect-[4/5] bg-brand-dark lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 320px"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-primary">
              {member.role}
            </p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">{member.name}</h3>
            {member.subtitle && (
              <p className="mt-3 text-sm text-muted-foreground">{member.subtitle}</p>
            )}
            {member.bio && (
              <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{member.bio}</p>
            )}
            {member.department && (
              <p className="mt-6 text-sm font-medium text-foreground/80">{member.department}</p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full", member.image && "overflow-hidden")}>
      {member.image && (
        <div className="relative aspect-[4/3] bg-brand-dark">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{member.name}</CardTitle>
        <p className="text-sm text-brand-primary">{member.role}</p>
      </CardHeader>
      <CardContent>
        {member.bio && (
          <p className="text-sm text-muted-foreground">{member.bio}</p>
        )}
      </CardContent>
    </Card>
  );
}
