import { AdminNote } from "@/components/admin/admin-note";
import { ResourcePage } from "@/components/admin/resource-page";
import { Button } from "@/components/ui/button";

export default function AdminContentsPage() {
  return (
    <ResourcePage
      actions={<Button variant="secondary">Yeni İçerik</Button>}
      title="İçerikler"
      description="Backend uçları: GET/POST/PATCH/DELETE /api/admin/content. Tipler: page, news, announcement, guide, legal, faq."
    >
      <AdminNote>
        Bu ekran CRUD formuna hazır panel alanıdır. İçerik editörü bağlanırken başlık, slug,
        özet, gövde, durum, yayın tarihi, dil ve öne çıkarma alanları kullanılacaktır.
      </AdminNote>
    </ResourcePage>
  );
}

