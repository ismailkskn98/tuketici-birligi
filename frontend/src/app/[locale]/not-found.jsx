import { ArrowLeft, Home, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="gridContainer relative isolate min-h-[calc(100vh-var(--site-header-height))] overflow-hidden bg-white py-16 sm:py-20 md:py-24">
      <GridPattern
        aria-hidden="true"
        className="fluid -z-10 text-primary-dark/[0.08] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
        height={34}
        strokeDasharray="3 5"
        width={34}
      />

      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-16">
        <section className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
            Sayfa bulunamadı
          </span>

          <p className="mt-6 font-heading text-[clamp(5.5rem,20vw,13rem)] font-semibold leading-none tracking-tight text-primary-dark/18">
            404
          </p>

          <h1 className="mt-2 max-w-2xl font-heading text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            Aradığınız sayfa taşınmış veya yayından kaldırılmış olabilir.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">
            Bağlantı güncel olmayabilir. Ana sayfaya dönebilir, başvuru ve iletişim kanallarına menü üzerinden tekrar ulaşabilirsiniz.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              render={
                <Link href="/">
                  <Home aria-hidden="true" className="size-4" />
                  Ana sayfaya dön
                </Link>
              }
              size="lg"
            />
            <Button
              className="border-line bg-white text-ink hover:bg-surface"
              render={
                <Link href="/iletisim">
                  <Mail aria-hidden="true" className="size-4" />
                  İletişime geç
                </Link>
              }
              size="lg"
              variant="outline"
            />
          </div>
        </section>

        <aside className="border-t border-line/80 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Yönlendirme</p>
          <nav aria-label="404 yardımcı bağlantılar" className="mt-4 grid gap-3">
            {[
              ["Başvuru rehberi", "/basvuru-rehberi"],
              ["Hak rehberleri", "/hak-rehberleri"],
              ["Sıkça sorulan sorular", "/sss"],
            ].map(([label, href]) => (
              <Link
                className="focus-ring group inline-flex items-center justify-between gap-4 border-b border-line/70 py-3 text-sm font-semibold text-ink transition hover:text-secondary-dark"
                href={href}
                key={href}
              >
                {label}
                <ArrowLeft aria-hidden="true" className="size-3.5 rotate-180 text-secondary transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}
