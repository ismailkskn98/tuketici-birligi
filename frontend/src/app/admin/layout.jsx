import { AdminShell } from "@/components/admin/admin-shell";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata = {
  title: "Admin | Tüketiciler Birliği",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }) {
  return (
    <html className={fontVariables} lang="tr">
      <body className="font-sans antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
