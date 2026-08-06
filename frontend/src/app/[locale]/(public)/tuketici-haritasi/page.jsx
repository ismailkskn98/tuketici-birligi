import { setRequestLocale } from "next-intl/server";
import { ProvinceMapSection } from "@/components/site/province-map";
import { getProvinceMap } from "@/lib/api";

export const metadata = {
  title: "Türkiye Tüketici Bilgilendirme Haritası",
  description: "İllere göre tüketici haberleri, duyuruları, rehberleri ve faaliyet kayıtları."
};

export default async function ConsumerMapPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const provinceMap = await getProvinceMap(locale);

  return <ProvinceMapSection data={provinceMap} />;
}
