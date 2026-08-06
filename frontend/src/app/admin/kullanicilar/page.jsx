import { AdminNote } from "@/components/admin/admin-note";
import { ResourcePage } from "@/components/admin/resource-page";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  return (
    <ResourcePage
      actions={<Button variant="secondary">Kullanıcı Ekle</Button>}
      title="Kullanıcılar"
      description="Admin ve editor rollerinin yönetimi için hazırlanmış panel alanı."
    >
      <AdminNote>
        Backend uçları: GET/POST/PATCH /api/admin/users. Şifreler bcrypt ile saklanır; gerçek
        şifreler `.env.example` dışında repoya yazılmaz.
      </AdminNote>
    </ResourcePage>
  );
}

