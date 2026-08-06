import { AdminNote } from "@/components/admin/admin-note";
import { ResourcePage } from "@/components/admin/resource-page";
import { Button } from "@/components/ui/button";

export default function AdminMediaPage() {
  return (
    <ResourcePage
      actions={<Button variant="secondary">Medya Yükle</Button>}
      title="Medya"
      description="Görsel dosyaları local upload veya ileride S3 üzerinden yönetilir."
    >
      <AdminNote>
        Backend uçları: GET/POST/DELETE /api/admin/media. İlk sürümde JPG, PNG, WEBP ve AVIF
        doğrulaması yapılır.
      </AdminNote>
    </ResourcePage>
  );
}

