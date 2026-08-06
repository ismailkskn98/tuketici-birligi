import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
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
    <aside className="px-2 lg:sticky lg:top-24 lg:px-0">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-muted shadow-[0_6px_18px_rgba(22,32,51,0.04)]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary/85" />
          {t("areasEyebrow")}
        </span>
        <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-ink">{t("areasTitle")}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{t("areasDescription")}</p>
      </div>

      <div className="mt-6 grid gap-1">
        {items.map((item, index) => (
          <AreaItem description={item.description} index={index + 1} key={item.title} title={item.title} />
        ))}
      </div>

      <Link
        className="focus-ring mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/72 transition hover:text-secondary-dark"
        href="/iletisim"
      >
        {t("areasCta")}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </aside>
  );
}
