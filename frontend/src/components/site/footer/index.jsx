import { getTranslations } from "next-intl/server";
import { footerLegalLinks, getFooterColumns } from "@/lib/navigation";
import { FooterBackground } from "./footer-background";
import { FooterBottom } from "./footer-bottom";
import { FooterBrand } from "./footer-brand";
import { FooterColumns } from "./footer-columns";
import { FooterContact } from "./footer-contact";
import { FooterCta } from "./footer-cta";

export async function Footer({ settings }) {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();
  const orgName = settings.organizationName || settings.shortName;

  const legalLinks = footerLegalLinks.map((link) => {
    if (link.href === "/gizlilik") return { ...link, label: t("privacy") };
    if (link.href === "/aydinlatma-metni") return { ...link, label: t("disclosure") };
    if (link.href === "/kvkk") return { ...link, label: t("kvkk") };
    if (link.href === "/sss") return { ...link, label: t("faq") };
    return link;
  });

  const columns = [...getFooterColumns(), { title: t("legal"), href: null, links: legalLinks }];

  return (
    <footer className="relative overflow-hidden text-ink">
      <FooterBackground />

      <FooterCta t={t} />

      <div className="relative gridContainer">
        <nav aria-label={t("navLabel")} className="py-10 md:py-14">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
            <FooterColumns columns={columns} />
            <FooterContact settings={settings} title={t("contact")} />
          </div>
        </nav>
      </div>

      <div className="relative gridContainer border-t border-line/80">
        <FooterBrand orgName={orgName} settings={settings} t={t} year={year} />
      </div>

      <div className="relative gridContainer border-t border-line/80 bg-white/45">
        <FooterBottom t={t} />
      </div>
    </footer>
  );
}
