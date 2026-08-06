import { AdminNote } from "@/components/admin/admin-note";
import { ResourcePage } from "@/components/admin/resource-page";

export default function AdminSettingsPage() {
  return (
    <ResourcePage
      title="Ayarlar"
      description="Kurum adı, açıklama, telefon, e-posta, adres, çalışma saatleri ve sosyal bağlantılar yönetilir."
    >
      <AdminNote>
        Backend uçları: GET/PATCH /api/admin/settings. Ayarlar locale bazlı tutulur; Türkçe
        varsayılan, İngilizce içerikler hazır olduğunda /en yapısı genişletilir.
      </AdminNote>
    </ResourcePage>
  );
}

