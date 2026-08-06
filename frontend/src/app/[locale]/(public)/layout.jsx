import { setRequestLocale } from "next-intl/server";
import { AccessRestrictedPageContent, PublicAccessGate } from "@/components/site/access-restricted";
import { Footer } from "@/components/site/footer/index";
import { Header2 } from "@/components/site/header/index2";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { getSiteSettings } from "@/lib/api";
import { ReactLenis } from "@/lib/lenis";

export default async function PublicLayout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSiteSettings(locale);

  return (
    <PublicAccessGate fallback={<AccessRestrictedPageContent />}>
      <ReactLenis root options={{ autoRaf: true, syncTouch: false, lerp: 0.15 }}>
        <Header2 settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <ScrollToTop />
      </ReactLenis>
    </PublicAccessGate>
  );
}
