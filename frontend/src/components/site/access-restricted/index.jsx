import { Home, ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";
import { PublicAccessGate } from "./layout-gate";

export { PublicAccessGate };

export async function AccessRestrictedPageContent() {
  const t = await getTranslations("AccessRestricted");

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#f7f4f2_100%)]">
      <GridPattern
        aria-hidden="true"
        className="fluid -z-10 text-primary-dark/[0.08] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
        height={34}
        strokeDasharray="3 5"
        width={34}
      />

      <div className="gridContainer flex min-h-screen items-center py-8 sm:py-10 md:py-12">
        <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-line/70 bg-white p-6 shadow-[0_28px_100px_rgba(15,23,42,0.08)] sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="inline-flex size-16 shrink-0 items-center justify-center rounded-[22px] bg-secondary/10 text-secondary md:size-20">
              <ShieldAlert aria-hidden="true" className="size-8 md:size-10" />
            </div>

            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary sm:text-xs">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
                {t("eyebrow")}
              </p>

              <p className="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
                {t("description")}
              </p>
            </div>
          </div>

          <h1 className="mt-8 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:mt-10 md:text-6xl">
            {t("title")}
          </h1>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
            <Button
              className="w-full sm:w-auto"
              render={
                <Link href="/">
                  <Home aria-hidden="true" className="size-4" />
                  {t("homeCta")}
                </Link>
              }
              size="lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
