"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { menuNavigation, mobileNavigation, primaryNavigation } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AuthNavButton } from "@/components/layout/auth-nav-button";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!moreOpen) return;
    const close = () => setMoreOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [moreOpen]);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between lg:h-[4.5rem]">
            <Link href="/" className="inline-flex shrink-0 items-center">
              <Logo size="sm" />
            </Link>

            {/* Masaüstü — sadece ana linkler + Katıl */}
            <nav className="hidden items-center gap-0.5 lg:flex">
              {primaryNavigation.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
              <Button asChild size="sm" className="ml-2">
                <Link href="/basvurular">Katıl</Link>
              </Button>
              <AuthNavButton />
            </nav>

            {/* Masaüstü — dark mode + overflow menü */}
            <div className="hidden items-center gap-1 lg:flex">
              <ThemeToggle />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  className={cn(
                    "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    moreOpen && "bg-muted text-foreground"
                  )}
                  aria-label="Menü"
                  aria-expanded={moreOpen}
                >
                  {moreOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {moreOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 cursor-default bg-transparent"
                      aria-label="Menüyü kapat"
                      onClick={() => setMoreOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-lg shadow-black/5">
                      {menuNavigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobil — yalnızca hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-foreground lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </div>

      {/* Mobil tam ekran menü */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Menüyü kapat"
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out sm:max-w-xs",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-sm font-semibold tracking-wide text-muted-foreground">Menü</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-foreground hover:bg-muted"
              aria-label="Menüyü kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {mobileNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
