"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, HelpCircle, Home, ImageIcon, LayoutDashboard, LogOut, MapPinned, Menu, MessageSquareText, Settings, Shield, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import { adminNavigation, pathMatchesHref } from "@/lib/navigation";
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
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3402"}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Oturum kapatılamadı.");

      toast.add({ title: "Oturum kapatıldı", description: "Güvenli şekilde çıkış yaptınız.", type: "success" });
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Çıkış yapılamadı",
        description: error.message || "Lütfen yeniden deneyin.",
        type: "error",
        priority: "high",
      });
    }
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
          const active = item.href === "/admin" ? pathname === item.href : pathMatchesHref(pathname, item.href);

          return (
            <Link
              className={cn(
                "focus-ring group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink",
                active && "bg-primary/[0.07] text-primary hover:bg-primary/[0.09] hover:text-primary before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-primary",
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
    <div className="min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white px-3 py-4 lg:flex lg:flex-col">
        <Link className="focus-ring flex items-center gap-3 rounded-md" href="/admin">
          <span className="grid size-10 place-items-center rounded-md border border-line bg-white shadow-xs">
            <Image alt="" height={32} src="/main-logo-yazisiz.svg" width={32} />
          </span>
          <span className="grid min-w-0">
            <span className="truncate text-sm font-semibold text-ink">Yönetim Paneli</span>
            <span className="truncate text-xs text-muted">Tüketici Birliği</span>
          </span>
        </Link>

        <div className="mt-7 border-t border-line pt-4">
          <p className="mb-2 px-3 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted">Çalışma alanı</p>
          {renderNavigation()}
        </div>

        <div className="mt-auto border-t border-line px-1 pt-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-surface text-muted">
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
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 supports-backdrop-filter:backdrop-blur-md">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button aria-expanded={mobileMenuOpen} aria-label="Admin menüsünü aç" className="lg:hidden" onClick={() => setMobileMenuOpen(true)} size="icon-sm" variant="outline">
                <Menu aria-hidden="true" className="size-4" />
              </Button>
              <div className="min-w-0">
                <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted">Tüketici Birliği</p>
                <p className="truncate text-base font-semibold tracking-[-0.025em] text-ink md:text-lg">İçerik ve başvuru yönetimi</p>
              </div>
            </div>
            <Button onClick={logout} type="button" variant="outline">
              <LogOut size={18} aria-hidden="true" />
              Çıkış
            </Button>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[96rem] px-4 py-6 md:px-8 md:py-8 xl:px-10">{children}</div>
      </div>

      <Drawer onOpenChange={setMobileMenuOpen} open={mobileMenuOpen} swipeDirection="left">
        <DrawerContent className="w-[min(21rem,calc(100vw-1.5rem))] bg-white lg:hidden">
          <DrawerTitle className="sr-only">Admin menüsü</DrawerTitle>
          <DrawerDescription className="sr-only">Yönetim paneli bölümleri arasında gezinin.</DrawerDescription>
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <div className="flex items-center justify-between gap-3">
              <Link className="focus-ring flex items-center gap-3 rounded-md" href="/admin">
                <Image alt="" height={40} src="/main-logo-yazisiz.svg" width={40} />
                <span className="grid">
                  <span className="text-sm font-bold text-ink">Yönetim Paneli</span>
                  <span className="text-xs text-muted">Tüketici Birliği</span>
                </span>
              </Link>
            </div>

            <div className="mt-7 min-h-0 overflow-y-auto border-t border-line pt-4">{renderNavigation({ mobile: true })}</div>
            <Button className="mt-auto justify-start" onClick={logout} type="button" variant="outline">
              <LogOut aria-hidden="true" className="size-4" />
              Güvenli çıkış
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
