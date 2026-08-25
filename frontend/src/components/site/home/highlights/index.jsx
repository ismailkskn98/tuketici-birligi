import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { HighlightParallaxImage } from "./highlight-parallax-image";

const HIGHLIGHTS = [
  {
    kicker: "İletişim",
    title: "Açık iletişim",
    text: "Telefon, e-posta, adres, form ve harita bilgileri tek sayfada toplanır.",
    href: "/iletisim",
    cta: "İletişime git",
    accent: "bg-secondary",
    imageSrc: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    parallaxRange: 10,
  },
  {
    kicker: "Başvuru",
    title: "Başvuru rehberi",
    text: "Başvuru öncesi gerekli bilgiler, belgeler ve kanallar sade şekilde anlatılır.",
    href: "/basvuru-rehberi",
    cta: "Rehberi incele",
    accent: "bg-wheat",
    imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    parallaxRange: 18,
  },
  {
    kicker: "Rehber",
    title: "Hak rehberleri",
    text: "Tüketicilerin en çok ihtiyaç duyduğu konular kategori bazlı yayınlanır.",
    href: "/hak-rehberleri",
    cta: "Rehberleri aç",
    accent: "bg-teal",
    imageSrc: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    parallaxRange: 26,
  },
];

const EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]";

export function HomeHighlights() {
  return (
    <section aria-labelledby="home-highlights-title" className="gridContainer">
      <h2 id="home-highlights-title" className="sr-only">
        Öne çıkan başlıklar
      </h2>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-5 lg:gap-6 xl:gap-7">
        {HIGHLIGHTS.map((item, index) => (
          <Reveal key={item.title} className="h-full" delay={index * 0.08} duration={0.6} viewport={{ once: true, amount: "some" }} y={12}>
            <Link
              href={item.href}
              className="group relative block h-full min-h-88 overflow-hidden rounded-2xl bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:min-h-96 lg:min-h-104 xl:min-h-112"
            >
              <HighlightParallaxImage
                alt=""
                range={item.parallaxRange}
                sizes="(max-width: 768px) 100vw, 50vw"
                src={item.imageSrc}
              />

              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/15" />

              <span className="absolute left-5 top-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] sm:left-6 sm:top-6">
                <span aria-hidden="true" className={`size-1.5 rounded-full ${item.accent}`} />
                {item.kicker}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                {/* Metin: hover'da sabit mesafe yukarı — layout yok, sadece transform */}
                <div className={`flex flex-col gap-2.5 transition-transform duration-500 ${EASE} will-change-transform sm:gap-3 sm:group-hover:-translate-y-10 sm:group-focus-visible:-translate-y-10`}>
                  <h3 className="text-balance font-heading text-[1.35rem] font-semibold leading-snug tracking-tight text-white sm:text-[1.45rem] lg:text-[1.55rem] xl:text-[1.65rem]">{item.title}</h3>
                  <p className="max-w-[32ch] text-[13.5px] leading-6 text-white/78 sm:text-sm sm:leading-6 lg:leading-7">{item.text}</p>
                </div>

                {/* CTA: alttan fade+slide; mobilde her zaman görünür */}
                <span
                  className={`mt-3.5 inline-flex max-w-fit items-center gap-2 text-[12px] font-semibold text-white transition-[opacity,transform] duration-500 ${EASE} will-change-transform sm:pointer-events-none sm:absolute sm:bottom-6 sm:left-6 sm:mt-0 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100 lg:bottom-7 lg:left-7`}
                >
                  {item.cta}
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ${EASE} group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-white/22`}
                  >
                    <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
