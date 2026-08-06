import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
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
        <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary-dark" />
          {t("areasEyebrow")}
        </span>
        <h2 className="mt-3 max-w-72 font-heading text-[1.55rem] font-semibold leading-snug tracking-tight text-ink">{t("areasTitle")}</h2>
      </div>

      <Stagger className="mt-8" stagger={0.07} viewport={{ once: true, amount: 0.25 }}>
        {items.map((item, index) => (
          <StaggerItem key={item.title} y={16}>
            <AreaItem description={item.description} index={index + 1} title={item.title} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-8 flex justify-end border-t border-line/60 pt-5">
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
