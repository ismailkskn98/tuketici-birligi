import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
  cutoutCardSurfaceClassName,
} from "@/components/ui/cutout-card";

const HIGHLIGHTS = [
  {
    kicker: "Öne çıkan",
    badge: "İletişim",
    title: "Açık iletişim",
    text: "Telefon, e-posta, adres, form ve harita bilgileri tek sayfada toplanır.",
    note: "Tüm iletişim kanalları tek yerde, net ve erişilebilir.",
    href: "/iletisim",
    cta: "İletişime git",
    meta: "Doğrudan erişim",
    footer: "İletişim bilgileri",
    imageSrc: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    pinClassName: "bg-ink text-white",
    pinCornerClassName: "text-ink",
  },
  {
    kicker: "Öne çıkan",
    badge: "Başvuru",
    title: "Başvuru rehberi",
    text: "Başvuru öncesi gerekli bilgiler, belgeler ve kanallar sade şekilde anlatılır.",
    note: "Süreci gereksiz karmaşa olmadan adım adım açıklar.",
    href: "/basvuru-rehberi",
    cta: "Rehberi incele",
    meta: "Adım adım süreç",
    footer: "Başvuru adımları",
    imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    pinClassName: "bg-primary-dark text-white",
    pinCornerClassName: "text-primary-dark",
  },
  {
    kicker: "Öne çıkan",
    badge: "Rehber",
    title: "Hak rehberleri",
    text: "Tüketicilerin en çok ihtiyaç duyduğu konular kategori bazlı yayınlanır.",
    note: "Hak arama süreçlerinde güven veren, düzenli içerik yapısı sunar.",
    href: "/hak-rehberleri",
    cta: "Rehberleri aç",
    meta: "Kategori bazlı içerik",
    footer: "Konu rehberleri",
    imageSrc: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
    pinClassName: "bg-secondary text-white",
    pinCornerClassName: "text-secondary",
  },
];

export function HomeHighlights() {
  return (
    <section aria-labelledby="home-highlights-title" className="gridContainer">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3 md:gap-3 lg:gap-4 xl:gap-5">
        {HIGHLIGHTS.map((item, index) => (
          <Reveal
            key={item.title}
            className="h-full"
            delay={index * 0.08}
            duration={0.6}
            viewport={{ once: true, amount: "some" }}
            y={12}
          >
            <CutoutCard className={`${cutoutCardSurfaceClassName} h-full rounded-2xl border border-line/80 bg-white text-ink shadow-sm md:rounded-[22px] 2xl:rounded-[28px]`}>
              <article className="flex h-full flex-col">
                <CutoutCardMedia className="h-56 rounded-t-2xl sm:h-60 md:h-40 lg:h-44 xl:h-52 2xl:h-72 md:rounded-t-[22px] 2xl:rounded-t-[28px]">
                  <CutoutCardImage alt="" sizes="(max-width: 768px) 100vw, 33vw" src={item.imageSrc} />
                  <CutoutCardOverlay className="from-black/45 via-black/5 to-transparent" />

                  <CutoutCardInsetLabel className="bottom-0 left-0 z-20 rounded-tr-[16px] bg-white px-3.5 py-2 md:px-3 md:py-1.5 lg:px-4 lg:py-2 xl:rounded-tr-[18px] 2xl:rounded-tr-[20px] 2xl:px-5 2xl:py-3">
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-muted md:text-[9px] lg:text-[10px] 2xl:text-[11px] 2xl:tracking-[0.18em]">{item.kicker}</span>
                    <CutoutCorner className="absolute -bottom-px -right-[31px] rotate-90 text-white" />
                    <CutoutCorner className="absolute -left-px -top-[31px] rotate-90 text-white" />
                  </CutoutCardInsetLabel>

                  <CutoutCardPin className={`right-0 top-0 z-20 rounded-bl-[14px] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] shadow-md ring-1 ring-white/15 md:px-2.5 md:py-1 lg:px-3 lg:py-1.5 xl:rounded-bl-[16px] 2xl:px-4 2xl:py-2 2xl:text-xs ${item.pinClassName}`}>
                    {item.badge}
                    <CutoutCorner className={`absolute -left-[23px] top-0 -rotate-90 ${item.pinCornerClassName}`} size={24} />
                    <CutoutCorner className={`absolute -bottom-[23px] right-0 -rotate-90 ${item.pinCornerClassName}`} size={24} />
                  </CutoutCardPin>
                </CutoutCardMedia>

                <CutoutCardContent className="flex flex-1 flex-col p-5 md:p-3.5 lg:p-4 xl:p-5 2xl:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted md:tracking-[0.12em] lg:text-[11px] 2xl:text-xs 2xl:tracking-[0.16em]">Bilgilendirme alanı</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-ink md:mt-1.5 md:text-base lg:mt-2 lg:text-lg xl:text-xl 2xl:mt-3 2xl:text-xl">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted md:mt-1.5 md:text-[13px] md:leading-5 lg:mt-2 lg:text-sm lg:leading-6 2xl:mt-3 2xl:leading-7">{item.text}</p>

                  <CutoutCardFooter className="mt-4 border-t border-line/80 pt-2.5 md:mt-3 md:pt-2 lg:mt-4 xl:mt-5 2xl:pt-3">
                    <span className="text-[11px] font-medium text-ink/70 md:text-[10px] lg:text-[11px] 2xl:text-xs">{item.footer}</span>
                    <span className="text-[10px] text-muted md:text-[9px] lg:text-[10px] 2xl:text-[11px]">{item.meta}</span>
                  </CutoutCardFooter>
                </CutoutCardContent>

                <CutoutCardAction className="bottom-4 right-4 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 2xl:bottom-5 2xl:right-5">
                  <Link
                    href={item.href}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 md:gap-1 md:px-2.5 md:py-1 md:text-[11px] lg:gap-1.5 lg:px-3 lg:py-1.5 lg:text-xs 2xl:gap-2 2xl:px-4 2xl:py-2 2xl:text-sm"
                  >
                    {item.cta}
                    <ArrowUpRight aria-hidden="true" className="size-3.5 md:size-3 lg:size-3.5 2xl:size-4" />
                  </Link>
                </CutoutCardAction>
              </article>
            </CutoutCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
