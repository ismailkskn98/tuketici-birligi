import { absoluteUrl } from "@/lib/utils";

export default function sitemap() {
  return [
    "",
    "/kurumsal",
    "/hak-rehberleri",
    "/haberler",
    "/duyurular",
    "/basvuru-rehberi",
    "/basvuru-yap",
    "/tuketici-haritasi",
    "/sss",
    "/iletisim",
    "/gizlilik",
    "/aydinlatma-metni",
    "/kvkk"
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date()
  }));
}
