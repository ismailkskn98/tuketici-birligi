import { AdminShell } from "@/components/admin/admin-shell";
import { Toaster } from "@/components/ui/toast";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata = {
  title: "Admin | Tüketici Birliği",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    <html className={fontVariables} lang="tr">
      <body className="admin-theme font-heading antialiased">
        <AdminShell>{children}</AdminShell>
        <Toaster />
      </body>
    </html>
  );
}
