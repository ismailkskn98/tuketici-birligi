import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { AreaItem } from "./area-item";

export async function AreasOfAction() {
  const t = await getTranslations("HomeFeed");
  const items = [
    {
      title: t("areaOneTitle"),
      description: t("areaOneDescription"),
    },
    {
      title: t("areaTwoTitle"),
      description: t("areaTwoDescription"),
    },
    {
      title: t("areaThreeTitle"),
      description: t("areaThreeDescription"),
    },
    {
      title: t("areaFourTitle"),
      description: t("areaFourDescription"),
    },
  ];

  return (
    <aside className="lg:sticky lg:top-24">
      <div>
        <SectionEyebrow>{t("areasEyebrow")}</SectionEyebrow>
        <h2 className="mt-3 max-w-72 font-heading text-[1.35rem] font-semibold leading-snug tracking-tight text-ink sm:mt-3.5 md:mt-4 md:text-[1.45rem] lg:text-[1.3rem] xl:text-[1.45rem] 2xl:text-[1.55rem]">{t("areasTitle")}</h2>
      </div>

      <Stagger className="mt-6 lg:mt-6 xl:mt-8" stagger={0.07} viewport={{ once: true, amount: 0.25 }}>
        {items.map((item, index) => (
          <StaggerItem key={item.title} y={16}>
            <AreaItem description={item.description} index={index + 1} title={item.title} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-6 flex justify-end border-t border-line/60 pt-4 lg:mt-7 xl:mt-8 xl:pt-5">
        <Link
          className="focus-ring inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition hover:text-secondary-dark"
          href="/iletisim"
        >
          {t("areasCta")}
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
