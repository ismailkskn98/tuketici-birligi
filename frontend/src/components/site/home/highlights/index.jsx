import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const HIGHLIGHTS = [
  {
    kicker: "İletişim",
    badge: "01",
    title: "Açık iletişim",
    text: "Telefon, e-posta, adres, form ve harita bilgileri tek sayfada toplanır.",
    href: "/iletisim",
    cta: "İletişime git",
    meta: "Doğrudan erişim",
    footer: "İletişim bilgileri",
    accent: "bg-primary",
    imageSrc: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    kicker: "Başvuru",
    badge: "02",
    title: "Başvuru rehberi",
    text: "Başvuru öncesi gerekli bilgiler, belgeler ve kanallar sade şekilde anlatılır.",
    href: "/basvuru-rehberi",
    cta: "Rehberi incele",
    meta: "Adım adım süreç",
    footer: "Başvuru adımları",
    accent: "bg-ink",
    imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
  },
  {
    kicker: "Rehber",
    badge: "03",
    title: "Hak rehberleri",
    text: "Tüketicilerin en çok ihtiyaç duyduğu konular kategori bazlı yayınlanır.",
    href: "/hak-rehberleri",
    cta: "Rehberleri aç",
    meta: "Kategori bazlı içerik",
    footer: "Konu rehberleri",
    accent: "bg-secondary",
    imageSrc: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
  },
];

export function HomeHighlights() {
  return (
    <section aria-labelledby="home-highlights-title" className="gridContainer">
      <h2 id="home-highlights-title" className="sr-only">
        Öne çıkan başlıklar
      </h2>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-5 lg:gap-6 xl:gap-7">
        {HIGHLIGHTS.map((item, index) => (
          <Reveal
            key={item.title}
            className="h-full"
            delay={index * 0.08}
            duration={0.6}
            viewport={{ once: true, amount: "some" }}
            y={12}
          >
            <Link
              href={item.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-white shadow-[0_1px_0_rgba(26,33,62,0.02),0_12px_36px_-24px_rgba(26,33,62,0.14)] transition duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-line hover:shadow-[0_2px_0_rgba(26,33,62,0.03),0_20px_48px_-24px_rgba(26,33,62,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/60"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-surface">
                <Image
                  alt=""
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  src={item.imageSrc}
                />
                <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/25 via-transparent to-transparent" />

                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink shadow-[0_1px_0_rgba(26,33,62,0.06)] ring-1 ring-line/60">
                  <span className={`size-1.5 rounded-full ${item.accent}`} aria-hidden="true" />
                  {item.kicker}
                </span>

                <span className="absolute right-4 top-4 font-heading text-[11px] font-semibold tracking-[0.14em] text-white/90">
                  {item.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6">
                <h3 className="text-balance font-heading text-[1.15rem] font-semibold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-ink lg:text-[1.2rem] xl:text-[1.3rem]">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-6 text-muted lg:text-sm lg:leading-6 xl:leading-7">
                  {item.text}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line/60 pt-4">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {item.footer}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink transition-colors duration-300 group-hover:text-secondary-dark">
                    {item.cta}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
