import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-32">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary">404</p>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Sayfa Bulunamadı</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Ana Sayfaya Dön</Link>
        </Button>
      </Container>
    </section>
  );
}
