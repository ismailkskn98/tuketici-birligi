"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, HelpCircle, Home, ImageIcon, LayoutDashboard, LogOut, MapPinned, Menu, MessageSquareText, Settings, Shield, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { adminNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const navigationIcons = {
  "/admin": LayoutDashboard,
  "/admin/hero": Home,
  "/admin/yonetim-kurulu": Users,
  "/admin/harita": MapPinned,
  "/admin/sss": HelpCircle,
  "/admin/icerikler": FileText,
  "/admin/formlar": MessageSquareText,
  "/admin/medya": ImageIcon,
  "/admin/ayarlar": Settings,
  "/admin/kullanicilar": Users,
};

export function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3402"}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.replace("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") {
    return children;
  }

  const navigation = adminNavigation.map((item) => ({
    ...item,
    icon: navigationIcons[item.href] || FileText,
  }));

  function renderNavigation({ mobile = false } = {}) {
    return (
      <nav className={cn("grid gap-1", mobile && "gap-2")} aria-label="Admin menü">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              className={cn(
                "focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink",
                active && "bg-ink text-white hover:bg-ink hover:text-white",
              )}
              href={item.href}
              key={item.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white p-4 lg:flex lg:flex-col">
        <Link className="focus-ring flex items-center gap-3 rounded-md" href="/admin">
          <span className="grid size-10 place-items-center rounded-md border border-line bg-white">
            <Image alt="" height={32} src="/main-logo-yazisiz.svg" width={32} />
          </span>
          <span className="grid min-w-0">
            <span className="truncate text-sm font-semibold text-ink">Yönetim Paneli</span>
            <span className="truncate text-xs text-muted">Tüketici Birliği</span>
          </span>
        </Link>

        <div className="mt-7">{renderNavigation()}</div>

        <div className="mt-auto rounded-lg border border-line bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md border border-line bg-white text-muted">
              <Shield aria-hidden="true" className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Admin oturumu</p>
              <p className="truncate text-xs text-muted">İçerik ve başvuru yönetimi</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-white">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button aria-expanded={mobileMenuOpen} aria-label="Admin menüsünü aç" className="lg:hidden" onClick={() => setMobileMenuOpen(true)} size="icon-sm" variant="outline">
                <Menu aria-hidden="true" className="size-4" />
              </Button>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">Tüketici Birliği</p>
                <p className="truncate text-base font-semibold tracking-[-0.02em] text-ink md:text-lg">İçerik ve başvuru yönetimi</p>
              </div>
            </div>
            <Button onClick={logout} type="button" variant="outline">
              <LogOut size={18} aria-hidden="true" />
              Çıkış
            </Button>
          </div>
        </header>
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Admin menüsünü kapat" className="absolute inset-0 bg-ink/25" onClick={() => setMobileMenuOpen(false)} type="button" />
          <div className="relative flex h-full w-[min(22rem,calc(100vw-2rem))] flex-col border-r border-line bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <Link className="focus-ring flex items-center gap-3 rounded-md" href="/admin">
                <Image alt="" height={40} src="/main-logo-yazisiz.svg" width={40} />
                <span className="grid">
                  <span className="text-sm font-bold text-ink">Yönetim Paneli</span>
                  <span className="text-xs text-muted">Tüketici Birliği</span>
                </span>
              </Link>
              <Button aria-label="Menüyü kapat" onClick={() => setMobileMenuOpen(false)} size="icon-sm" type="button" variant="ghost">
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>

            <div className="mt-8">{renderNavigation({ mobile: true })}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
