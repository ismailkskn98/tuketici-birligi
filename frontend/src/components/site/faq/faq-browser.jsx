"use client";

import { ArrowUpRight, Check, LinkIcon, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
        "group relative scroll-mt-24 overflow-hidden rounded-2xl border border-line/70 bg-white shadow-[0_1px_0_rgba(26,33,62,0.02),0_12px_36px_-24px_rgba(26,33,62,0.10)] transition duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-line hover:shadow-[0_2px_0_rgba(26,33,62,0.03),0_20px_44px_-24px_rgba(26,33,62,0.16)]",
        accordion && open && "-translate-y-0.5",
      )}
      id={item.slug}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3 px-5 pt-5 md:px-6 md:pt-6 xl:px-7 xl:pt-7">
          <div className="min-w-0 flex-1">
            {accordion ? (
              <button aria-controls={`${item.slug}-answer`} aria-expanded={open} className="focus-ring block text-left" onClick={onToggle} type="button">
                <h2 className="text-balance font-heading text-base font-semibold leading-snug tracking-tight text-ink md:text-[1.05rem] lg:text-lg xl:text-[1.15rem] 2xl:text-xl 2xl:leading-snug">
                  {item.title}
                </h2>
              </button>
            ) : (
              <h2 className="text-balance font-heading text-base font-semibold leading-snug tracking-tight text-ink md:text-[1.05rem] lg:text-lg xl:text-[1.15rem] 2xl:text-xl 2xl:leading-snug">
                {item.title}
              </h2>
            )}
          </div>

          {item.summary ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line/70 bg-surface/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/70">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
              {item.summary}
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "grid px-5 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:px-6 xl:px-7",
            showBody ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
          id={`${item.slug}-answer`}
        >
          <div className="overflow-hidden">
            {item.body ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted md:mt-3 md:text-[13px] md:leading-6 xl:mt-4 xl:text-sm xl:leading-7 2xl:text-[15px] 2xl:leading-8">
                {item.body}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/60 px-5 py-3 md:mt-5 md:px-6 md:py-3.5 xl:mt-6 xl:px-7 xl:py-4">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
            {item.summary || "Sık sorulan"}
          </span>

          {accordion && !open ? (
            <button
              className="focus-ring inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors duration-300 group-hover:text-secondary-dark md:text-xs"
              onClick={onToggle}
              type="button"
            >
              {showAnswerLabel}
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {accordion ? (
                <button className="focus-ring text-[11px] font-semibold text-muted transition-colors duration-300 hover:text-ink md:text-xs" onClick={onToggle} type="button">
                  {hideAnswerLabel}
                </button>
              ) : null}
              <button
                aria-label={justCopied ? copiedLabel : copyLinkLabel}
                className="focus-ring inline-flex items-center gap-2 text-[11px] font-semibold text-muted transition-colors duration-300 hover:text-secondary-dark md:text-xs"
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
        <div className={cn("mx-auto w-full rounded-2xl border border-dashed border-line bg-white/80 px-5 py-10 text-center text-sm text-muted md:rounded-3xl md:px-6 md:py-14", accordion && "max-w-2xl lg:max-w-3xl xl:max-w-3xl 2xl:max-w-4xl")}>{emptyText}</div>
      )}
    </div>
  );
}
