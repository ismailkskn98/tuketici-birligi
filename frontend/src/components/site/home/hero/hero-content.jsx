import Image from "next/image";
import { useLocale } from "next-intl";
import { HiArrowRight } from "react-icons/hi2";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { FadeIn } from "@/components/motion/reveal";

// export const HERO_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80";
export const HERO_FALLBACK_IMAGE = "/ornek-hero.webp";

function resolveHeroImages(slide) {
  const desktop = slide.imageDesktop || slide.image || HERO_FALLBACK_IMAGE;
  const mobile = slide.imageMobile || desktop;
  const tablet = slide.imageTablet || desktop;

  return { desktop, mobile, tablet };
}

/**
 * Full-bleed image + dark washes.
 * Parallax attrs follow Swiper Studio "Jewelry & Luxury Watches" transition layering.
 * Three sources match carousel aspect ratios: mobile 16/15, tablet 16/9, desktop 16/6.
 */
export function HeroContent({ slide, labels, priority = false }) {
  const locale = useLocale();
  const hasMeta = Boolean(slide.category || slide.date);
  const images = resolveHeroImages(slide);

  return (
    <div data-hero-slide className="relative flex h-full min-h-0 items-center overflow-hidden bg-card-foreground rounded-2xl">
      <div className="absolute inset-0 overflow-hidden" data-swiper-parallax="12%" data-swiper-parallax-opacity="0.85">
        <Image alt="" className="object-cover object-right sm:hidden" fill priority={priority} sizes="100vw" src={images.mobile} quality={100} />
        <Image alt="" className="hidden object-cover object-right sm:block xl:hidden" fill priority={priority} sizes="100vw" src={images.tablet} quality={100} />
        <Image alt="" className="hidden object-cover object-right xl:block" fill priority={priority} sizes="100vw" src={images.desktop} quality={100} />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full lg:w-[70%] bg-linear-to-tr from-card-foreground/70 from-45% to-transparent lg:[mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_35%,rgba(0,0,0,.9)_55%,rgba(0,0,0,.5)_75%,transparent_100%)]
    lg:[-webkit-mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_35%,rgba(0,0,0,.9)_55%,rgba(0,0,0,.5)_75%,transparent_100%)]"
      />

      <div className="gridContainer relative z-10 w-full py-12 sm:py-20 md:py-24 lg:py-28">
        <FadeIn className="max-w-xl pr-10 sm:pr-10 lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl" delay={0.08} duration={0.55} viewport={{ once: true, amount: 0.45 }}>
          {hasMeta ? (
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-white/55 sm:text-[11px]"
              data-swiper-parallax="-24"
              data-swiper-parallax-opacity="0"
            >
              {slide.category ? <span>{slide.category}</span> : null}
              {slide.category && slide.date ? <span aria-hidden="true" className="h-px w-5 bg-white/30" /> : null}
              {slide.date ? <time dateTime={slide.date}>{formatDate(slide.date, locale)}</time> : null}
            </div>
          ) : null}

          <h1
            className="mt-3 font-heading text-[1.55rem] font-semibold leading-[1.1] tracking-tight text-white sm:mt-5 sm:text-4xl sm:leading-[1.05] md:text-[2.5rem] md:leading-[1.06] lg:text-[2.65rem] lg:leading-[1.05] xl:text-[3rem] xl:leading-[1.04] 2xl:text-[4.25rem] 2xl:leading-[1.02]"
            data-swiper-parallax="-48"
            data-swiper-parallax-opacity="0"
            data-swiper-parallax-duration="700"
          >
            {slide.title}
          </h1>

          {slide.summary ? (
            <p
              className="mt-3 max-w-md font-sans text-[13px] leading-5 text-white/70 sm:mt-5 sm:text-sm sm:leading-7 md:text-base md:leading-7 lg:leading-8 xl:max-w-lg 2xl:text-lg 2xl:leading-8"
              data-swiper-parallax="-36"
              data-swiper-parallax-opacity="0"
              data-swiper-parallax-duration="800"
            >
              {slide.summary}
            </p>
          ) : null}

          {slide.href ? (
            <div className="mt-5 sm:mt-9" data-swiper-parallax="-28" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="900">
              <Link
                className="focus-ring group inline-flex items-center gap-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white sm:text-[11px] sm:tracking-[0.2em]"
                href={slide.href}
              >
                {slide.ctaLabel || labels.readMore}
                <HiArrowRight aria-hidden="true" className="size-3 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 sm:size-3.5" />
              </Link>
            </div>
          ) : null}
        </FadeIn>
      </div>
    </div>
  );
}
