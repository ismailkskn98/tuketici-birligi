import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
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
    <section aria-labelledby="home-highlights-title" className="gridContainer pb-10 md:pb-14">
      <Stagger className="grid gap-8" stagger={0.08} viewport={{ once: true, amount: 0.18 }}>
        {/* <div id="home-highlights-title">
          <SectionHeading
            eyebrow="Öne çıkanlar"
            title="Bilgiye hızlı erişim sağlayan sade bir deneyim"
            description="Ana temas noktalarını tek bakışta görünür kılan bu alan, ziyaretçilerin ihtiyaç duyduğu bilgiye daha kısa sürede ve daha az karmaşayla ulaşmasını destekler."
          />
        </div> */}

        <div className="grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <CutoutCard className={`${cutoutCardSurfaceClassName} h-full rounded-[28px] border border-line/80 bg-white text-ink shadow-sm`}>
                <article className="flex h-full flex-col">
                  <CutoutCardMedia className="h-72 rounded-t-[28px]">
                    <CutoutCardImage alt="" sizes="(max-width: 768px) 100vw, 33vw" src={item.imageSrc} />
                    <CutoutCardOverlay className="from-black/45 via-black/5 to-transparent" />

                    <CutoutCardInsetLabel className="bottom-0 left-0 z-20 rounded-tr-[20px] bg-white px-5 py-3">
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{item.kicker}</span>
                      <CutoutCorner className="absolute -bottom-px -right-[31px] rotate-90 text-white" />
                      <CutoutCorner className="absolute -left-px -top-[31px] rotate-90 text-white" />
                    </CutoutCardInsetLabel>

                    <CutoutCardPin className={`right-0 top-0 z-20 rounded-bl-[16px] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] shadow-md ring-1 ring-white/15 ${item.pinClassName}`}>
                      {item.badge}
                      <CutoutCorner className={`absolute -left-[23px] top-0 -rotate-90 ${item.pinCornerClassName}`} size={24} />
                      <CutoutCorner className={`absolute -bottom-[23px] right-0 -rotate-90 ${item.pinCornerClassName}`} size={24} />
                    </CutoutCardPin>

                    {/* <div className="absolute inset-x-6 bottom-16 z-10 flex items-center justify-end">
                    <div className="max-w-56 text-white">
                      <p className="text-sm font-semibold leading-6 text-white drop-shadow-sm">{item.note}</p>
                    </div>
                  </div> */}
                  </CutoutCardMedia>

                  <CutoutCardContent className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Bilgilendirme alanı</p>
                    <h3 className="mt-3 text-xl font-semibold leading-snug text-ink">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted">{item.text}</p>

                    <CutoutCardFooter className="mt-5 border-t border-line/80 pt-3">
                      <span className="text-xs font-medium text-ink/70">{item.footer}</span>
                      <span className="text-[11px] text-muted">{item.meta}</span>
                    </CutoutCardFooter>
                  </CutoutCardContent>

                  <CutoutCardAction className="bottom-5 right-5">
                    <Link
                      href={item.href}
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5"
                    >
                      {item.cta}
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                  </CutoutCardAction>
                </article>
              </CutoutCard>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </section>
  );
}
