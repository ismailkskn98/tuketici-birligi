import { AdminPage } from "@/components/admin/common/admin-page";

export function ResourcePage({ title, description, actions, children }) {
  return (
    <AdminPage actions={actions} description={description} title={title}>
      <section className="rounded-lg border border-line bg-white p-4 shadow-xs md:p-5">{children}</section>
    </AdminPage>
  );
}
