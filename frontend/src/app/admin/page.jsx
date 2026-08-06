import { AdminNote } from "@/components/admin/admin-note";
import { AdminPage } from "@/components/admin/common/admin-page";
import { AdminStatCard } from "@/components/admin/common/admin-stat-card";
import { FileText, Images, Inbox, Settings } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <AdminPage
      title="Özet"
      description="İçerik, başvuru, medya, ayar ve kullanıcı yönetimi için hazırlanmış admin çalışma alanı."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard description="Haber, duyuru, rehber ve yasal sayfalar" icon={FileText} title="İçerikler" value="Hazır" />
        <AdminStatCard description="İletişim ve ön başvuru kayıtları" icon={Inbox} title="Formlar" value="Hazır" />
        <AdminStatCard description="Hero ve medya görselleri" icon={Images} title="Medya" value="16:9" />
        <AdminStatCard description="Kurum bilgileri ve sosyal bağlantılar" icon={Settings} title="Ayarlar" value="Locale" />
      </div>
      <section className="rounded-lg border border-line bg-white p-4 shadow-xs">
        <AdminNote>
          Seed içerikler yer tutucudur. Yayına çıkmadan önce kurumun özgün metinleri, logo,
          gerçek iletişim bilgileri ve görselleri tamamlanmalıdır.
        </AdminNote>
      </section>
    </AdminPage>
  );
}
