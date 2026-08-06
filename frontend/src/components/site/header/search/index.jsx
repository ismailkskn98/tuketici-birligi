"use client";

import { useEffect, useState } from "react";
import { BookOpen, Building2, FileText, Home, MapPinned, Megaphone, Newspaper, PenLine, Phone, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
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
        dialogClassName="top-[min(16vh,6.5rem)] translate-y-0 gap-0 overflow-hidden rounded-2xl border border-line/50 bg-white p-0 shadow-soft ring-0 sm:max-w-xl"
        drawerClassName="z-60 bg-white"
        hideTitle
        onOpenChange={setOpen}
        open={open}
        showCloseButton={false}
        title={t("title")}
      >
        <Command className="bg-transparent">
          <CommandInput className="h-14 text-[15px]" placeholder={t("placeholder")} />

          <div className="relative">
            <CommandList className="site-search-scroll max-h-[min(28rem,58dvh)] px-2 py-3 sm:max-h-[min(22rem,48vh)]">
              <CommandEmpty>{t("noResults")}</CommandEmpty>
              <CommandGroup heading={t("pages")}>
                {publicNavigation.map((item) => {
                  const Icon = navIcons[item.key] || FileText;

                  return (
                    <CommandItem
                      className="rounded-lg px-3 py-2.5"
                      key={item.href}
                      onSelect={() => goTo(item.href)}
                      value={tNav(item.key)}
                    >
                      <Icon aria-hidden="true" className="size-4 shrink-0 text-muted" strokeWidth={1.6} />
                      <span className="flex-1">{tNav(item.key)}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <ProgressiveBlur blurLevels={[0.4, 1, 2, 4]} className="h-8" height="2rem" position="bottom" />
          </div>

          <div className="hidden items-center justify-between gap-3 border-t border-line/50 px-4 py-2.5 sm:flex">
            <p className="font-sans text-[11px] text-muted">{t("hint")}</p>
            <div className="flex items-center gap-3 font-sans text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="text-[10px] text-ink/45">↵</kbd>
                {t("open")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <kbd className="text-[10px] text-ink/45">esc</kbd>
                {t("close")}
              </span>
            </div>
          </div>
        </Command>
      </ResponsiveModal>
    </div>
  );
}
