"use client";

import { ArrowUpRight, Check, LinkIcon, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CutoutCorner } from "@/components/ui/cutout-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function getCategories(items) {
  return [...new Set(items.map((item) => item.summary).filter(Boolean))];
}

function FaqItem({ accordion, copiedLabel, copyLinkLabel, hideAnswerLabel, item, onCopy, justCopied, open, onToggle, showAnswerLabel }) {
  const showBody = !accordion || open;

  return (
    <article
      className={cn(
        "group relative scroll-mt-24 overflow-hidden rounded-2xl border border-line/80 bg-white shadow-[0_12px_40px_rgba(22,32,51,0.05)] transition duration-300 md:rounded-[20px] 2xl:rounded-[24px]",
        "hover:border-primary/35 hover:shadow-soft",
        accordion && open && "-translate-y-0.5",
      )}
      id={item.slug}
    >
      {item.summary ? (
        <span className="absolute right-0 top-0 z-10 rounded-bl-[14px] bg-ink px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white md:rounded-bl-[16px] md:px-3 md:py-1.5 md:text-[10px] 2xl:rounded-bl-[18px] 2xl:px-3.5 2xl:py-2">
          {item.summary}
          <CutoutCorner className="absolute -bottom-[23px] right-0 -rotate-90 text-ink" size={24} />
          <CutoutCorner className="absolute -left-[23px] top-0 -rotate-90 text-ink" size={24} />
        </span>
      ) : null}

      <div className="flex h-full flex-col">
        <div className={cn("p-4 pb-0 md:p-5 md:pb-0 lg:p-5 xl:p-6 xl:pb-0 2xl:p-7 2xl:pb-0", item.summary && "pr-14 md:pr-20 xl:pr-22 2xl:pr-24")}>
          {accordion ? (
            <button aria-controls={`${item.slug}-answer`} aria-expanded={open} className="focus-ring text-left" onClick={onToggle} type="button">
              <h2 className="font-heading text-base font-semibold leading-snug tracking-tight text-ink md:text-[1.05rem] lg:text-lg xl:text-lg 2xl:text-xl 2xl:leading-snug">{item.title}</h2>
            </button>
          ) : (
            <h2 className="font-heading text-base font-semibold leading-snug tracking-tight text-ink md:text-[1.05rem] lg:text-lg xl:text-lg 2xl:text-xl 2xl:leading-snug">{item.title}</h2>
          )}

          <div className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out", showBody ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} id={`${item.slug}-answer`}>
            <div className="overflow-hidden">
              {item.body ? <p className="mt-3 max-w-3xl text-sm leading-6 text-muted md:mt-3 md:text-[13px] md:leading-6 lg:leading-6 xl:mt-4 xl:text-sm xl:leading-7 2xl:text-[15px] 2xl:leading-8">{item.body}</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/80 px-4 py-3 md:mt-5 md:px-5 md:py-3.5 lg:mt-5 xl:mt-6 xl:px-6 xl:py-4 2xl:px-7">
          <span className="text-[11px] font-medium text-ink/55 md:text-xs">{item.summary}</span>

          {accordion && !open ? (
            <button className="focus-ring inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink/60 transition group-hover:text-secondary md:text-xs" onClick={onToggle} type="button">
              {showAnswerLabel}
              <ArrowUpRight aria-hidden="true" className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {accordion ? (
                <button className="focus-ring text-[11px] font-semibold text-ink/50 transition hover:text-ink md:text-xs" onClick={onToggle} type="button">
                  {hideAnswerLabel}
                </button>
              ) : null}
              <button
                aria-label={justCopied ? copiedLabel : copyLinkLabel}
                className="focus-ring inline-flex items-center gap-2 text-[11px] font-semibold text-ink/60 transition hover:text-secondary md:text-xs"
                onClick={(event) => {
                  event.stopPropagation();
                  onCopy(item.slug);
                }}
                type="button"
              >
                {justCopied ? copiedLabel : copyLinkLabel}
                {justCopied ? <Check aria-hidden="true" className="size-3.5 text-secondary" /> : <LinkIcon aria-hidden="true" className="size-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function FaqBrowser({
  accordion = false,
  allLabel,
  categoriesLabel,
  clearSearchLabel,
  copiedLabel = "Kopyalandı",
  copyLinkLabel,
  emptyText,
  hideAnswerLabel = "Gizle",
  items,
  searchPlaceholder,
  showAnswerLabel = "Yanıtı göster",
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedSlug, setCopiedSlug] = useState("");
  const [openSlug, setOpenSlug] = useState(() => (accordion && items[0]?.slug) || "");
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const categories = useMemo(() => getCategories(items), [items]);
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (activeCategory !== "all" && item.summary !== activeCategory) return false;
        if (!normalizedQuery) return true;

        return `${item.title} ${item.body || ""} ${item.summary || ""}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery);
      }),
    [activeCategory, items, normalizedQuery],
  );

  useEffect(() => {
    if (!copiedSlug) return undefined;
    const timer = window.setTimeout(() => setCopiedSlug(""), 1800);
    return () => window.clearTimeout(timer);
  }, [copiedSlug]);

  useEffect(() => {
    if (!accordion) return;
    if (!filteredItems.length) {
      setOpenSlug("");
      return;
    }
    if (!filteredItems.some((item) => item.slug === openSlug)) {
      setOpenSlug(filteredItems[0].slug || "");
    }
  }, [accordion, filteredItems, openSlug]);

  function copyLink(slug) {
    if (!slug || typeof window === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${slug}`);
    setCopiedSlug(slug);
  }

  function toggleItem(slug) {
    setOpenSlug((current) => (current === slug ? "" : slug));
  }

  return (
    <div className="grid gap-6 md:gap-7 lg:gap-8 2xl:gap-10">
      <div className="mx-auto grid w-full max-w-lg gap-4 md:max-w-xl md:gap-5">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            className="h-11 rounded-full border-line/90 bg-white pl-11 pr-11 text-sm shadow-xs placeholder:text-muted md:h-12"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            value={query}
          />
          {query ? (
            <button
              aria-label={clearSearchLabel}
              className="focus-ring absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
              onClick={() => setQuery("")}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        <div aria-label={categoriesLabel} className="flex flex-wrap justify-center gap-x-1 gap-y-2">
          {[allLabel, ...categories].map((category, index) => {
            const value = index === 0 ? "all" : category;
            const active = activeCategory === value;

            return (
              <button
                className={cn("focus-ring rounded-full px-3 py-1.5 text-[13px] font-medium transition md:px-3.5 md:text-sm", active ? "bg-ink text-white" : "text-muted hover:text-ink")}
                key={value}
                onClick={() => setActiveCategory(value)}
                type="button"
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {filteredItems.length ? (
        <div className={cn("mx-auto grid w-full gap-3 md:gap-3.5 lg:gap-4", accordion && "max-w-2xl lg:max-w-3xl xl:max-w-3xl 2xl:max-w-4xl")}>
          {filteredItems.map((item) => (
            <FaqItem
              accordion={accordion}
              copiedLabel={copiedLabel}
              copyLinkLabel={copyLinkLabel}
              hideAnswerLabel={hideAnswerLabel}
              item={item}
              justCopied={copiedSlug === item.slug}
              key={item.slug || item.id}
              onCopy={copyLink}
              onToggle={() => toggleItem(item.slug)}
              open={!accordion || openSlug === item.slug}
              showAnswerLabel={showAnswerLabel}
            />
          ))}
        </div>
      ) : (
        <div className={cn("mx-auto w-full rounded-2xl border border-dashed border-line bg-white/80 px-5 py-10 text-center text-sm text-muted md:rounded-[24px] md:px-6 md:py-14", accordion && "max-w-2xl lg:max-w-3xl xl:max-w-3xl 2xl:max-w-4xl")}>{emptyText}</div>
      )}
    </div>
  );
}
