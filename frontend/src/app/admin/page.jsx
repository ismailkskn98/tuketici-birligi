import {
  ArrowUpRight,
  FileText,
  HelpCircle,
  Home,
  MapPinned,
  MessageSquareText,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/common/admin-page";

const workspaceLinks = [
  {
    description: "Anasayfa carousel metinlerini ve cihaz görsellerini yönetin.",
    href: "/admin/hero",
    icon: Home,
    title: "Hero alanı",
  },
  {
    description: "Kurul üyelerini, görevleri, kategorileri ve yayın durumunu düzenleyin.",
    href: "/admin/yonetim-kurulu",
    icon: Users,
    title: "Yönetim Kurulu",
  },
  {
    description: "İl bazlı içerikleri ve harita bağlantılarını güncelleyin.",
    href: "/admin/harita",
    icon: MapPinned,
    title: "Tüketici haritası",
  },
  {
    description: "Sık sorulan soruları iki dilde hazırlayın ve yayınlayın.",
    href: "/admin/sss",
    icon: HelpCircle,
    title: "Sık sorulan sorular",
  },
  {
    description: "Haber, duyuru, rehber ve bilgilendirme içeriklerini yönetin.",
    href: "/admin/icerikler",
    icon: FileText,
    title: "İçerikler",
  },
  {
    description: "İletişim ve tüketici ön başvurularını inceleyin.",
    href: "/admin/formlar",
    icon: MessageSquareText,
    title: "Form kayıtları",
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminPage
      actions={
        <Link
          className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
          href="/admin/ayarlar"
        >
          <Settings aria-hidden="true" className="size-4" />
          Site ayarları
        </Link>
      }
      description="İçerikleri, kurul kayıtlarını ve ziyaretçi başvurularını tek çalışma alanından yönetin."
      title="Genel bakış"
    >
      <section className="overflow-hidden rounded-lg border border-line bg-white" aria-labelledby="workspace-title">
        <div className="border-b border-line px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold tracking-[-0.02em] text-ink" id="workspace-title">
            Yönetim alanları
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">Düzenlemek istediğiniz bölümü seçin.</p>
        </div>

        <div className="grid md:grid-cols-2">
          {workspaceLinks.map(({ description, href, icon: Icon, title }, index) => (
            <Link
              className={`focus-ring group flex min-w-0 items-start gap-4 border-line px-5 py-5 transition-colors hover:bg-surface/70 sm:px-6 ${
                index > 1 ? "border-t" : index === 1 ? "border-t md:border-t-0" : ""
              } ${index % 2 === 1 ? "md:border-l" : ""}`}
              href={href}
              key={href}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-surface text-primary">
                <Icon aria-hidden="true" className="size-[1.125rem]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="font-semibold tracking-[-0.015em] text-ink">{title}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </span>
                <span className="mt-1 block max-w-xl text-sm leading-6 text-muted">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </AdminPage>
  );
}
