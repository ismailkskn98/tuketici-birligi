"use client";

import { useEffect, useState } from "react";
import { BookOpen, Building2, FileText, Home, MapPinned, Megaphone, Newspaper, PenLine, Phone, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { cn } from "@/lib/utils";
import { publicNavigation } from "@/lib/navigation";

const navIcons = {
  home: Home,
  corporate: Building2,
  guides: BookOpen,
  news: Newspaper,
  announcements: Megaphone,
  applicationGuide: FileText,
  applyNow: PenLine,
  provinceMap: MapPinned,
  contact: Phone,
};

export function SiteSearch({
  className,
  onBeforeOpen,
  onOpenChange,
  open: openProp,
  showTrigger = true,
  triggerClassName,
} = {}) {
  const t = useTranslations("Search");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  function setOpen(next) {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function openSearch() {
    onBeforeOpen?.();
    setOpen(true);
  }

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!open) onBeforeOpen?.();
        setOpen(!open);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBeforeOpen, open]);

  function goTo(href) {
    setOpen(false);
    router.push(href);
  }

  return (
    <div className={cn(className)}>
      {showTrigger ? (
        <button
          aria-label={t("trigger")}
          className={cn(
            "focus-ring inline-flex size-8 cursor-pointer items-center justify-center text-ink/70 transition-colors hover:text-ink sm:size-9 lg:size-8 xl:size-9",
            triggerClassName,
          )}
          onClick={openSearch}
          type="button"
        >
          <Search aria-hidden="true" className="size-3.5 sm:size-4 lg:size-3.5 xl:size-4" strokeWidth={1.75} />
        </button>
      ) : null}

      <ResponsiveModal
        description={t("placeholder")}
        dialogClassName="top-[min(14vh,5.5rem)] translate-y-0 gap-0 overflow-hidden rounded-2xl border border-line/70 bg-white p-0 shadow-[0_18px_56px_-24px_rgba(26,33,62,0.22)] ring-0 sm:max-w-xl"
        drawerClassName="z-60 bg-white"
        hideTitle
        onOpenChange={setOpen}
        open={open}
        showCloseButton={false}
        title={t("title")}
      >
        <Command className="bg-transparent">
          <div className="border-b border-line/60 px-5 pt-4 pb-3 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {t("title")}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-muted">
              {t("description") || t("placeholder")}
            </p>
          </div>

          <CommandInput className="h-14 text-[15px]" placeholder={t("placeholder")} />

          <CommandList className="site-search-scroll max-h-[min(28rem,58dvh)] px-2 py-3 sm:max-h-[min(22rem,48vh)]">
            <CommandEmpty>{t("noResults")}</CommandEmpty>
            <CommandGroup heading={t("pages")}>
              {publicNavigation.map((item) => {
                const Icon = navIcons[item.key] || FileText;

                return (
                  <CommandItem
                    className="gap-3 rounded-lg px-3 py-2.5"
                    key={item.href}
                    onSelect={() => goTo(item.href)}
                    value={tNav(item.key)}
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface text-ink/70">
                      <Icon aria-hidden="true" className="size-3.5" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">{tNav(item.key)}</span>
                    <span className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted/70 sm:inline">
                      {item.href.replace(/^\/(tr|en)/, "").replace(/^\//, "") || "—"}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>

          <div className="hidden items-center justify-between gap-3 border-t border-line/60 px-5 py-2.5 text-[11px] text-muted sm:flex sm:px-6">
            <span>{t("hint")}</span>
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line/70 bg-surface px-1 font-sans text-[10px] font-semibold text-ink/70">↵</kbd>
                {t("open")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <kbd className="inline-flex h-5 min-w-8 items-center justify-center rounded border border-line/70 bg-surface px-1 font-sans text-[10px] font-semibold text-ink/70">esc</kbd>
                {t("close")}
              </span>
            </span>
          </div>
        </Command>
      </ResponsiveModal>
    </div>
  );
}
