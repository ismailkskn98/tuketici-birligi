import { FadeIn } from "@/components/motion/reveal";
import LogoLoop from "@/components/ui/logo-loop";

const HOME_LOGOS = [
  {
    src: "/logos-carousel/kvkk.png",
    alt: "Kişisel Verileri Koruma Kurumu",
  },
  {
    src: "/logos-carousel/bilgi-edinme-degerlendirme-kurumu.png",
    alt: "Bilgi Edinme Değerlendirme Kurulu",
  },
  {
    src: "/logos-carousel/anayasa-mahkemesi.png",
    alt: "Anayasa Mahkemesi",
  },
  {
    src: "/logos-carousel/tbmm.png",
    alt: "Türkiye Büyük Millet Meclisi",
  },
  {
    src: "/logos-carousel/tccb.png",
    alt: "T.C. Cumhurbaşkanlığı",
  },
  {
    src: "/logos-carousel/cimer.png",
    alt: "CIMER",
  },
  {
    src: "/logos-carousel/kamu-denetciligi-kurumu.png",
    alt: "Kamu Denetçiliği Kurumu",
  },
];

export function HomeLogoCarousel() {
  return (
    <section aria-label="Kurumsal başvuru ve hak arama bağlantıları" className="gridContainer pt-6 sm:pt-10 md:pt-12 2xl:px-16">
      {/* 2xl:fluid relative overflow-hidden rounded-2xl bg-white 2xl:mx-16 aspect-16/15 sm:aspect-video xl:aspect-16/6 */}
      <FadeIn className="w-full 2xl:fluid" delay={0.12} duration={0.65} viewport={{ once: true, amount: 0.35 }}>
        <LogoLoop aria-label="Kurumsal logolar" className="w-full logo-loop-edge-fade" logos={HOME_LOGOS} pauseOnHover />
      </FadeIn>
    </section>
  );
}
