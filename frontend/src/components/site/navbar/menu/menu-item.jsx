"use client";

import { useContext, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActiveNavUnderline, HoverHighlight } from "./hover-highlight";
import { MenuContext, MenuHoverContext, NavAnchor, isPlaceholderHref, transition } from "./shared";

/**
 * Top-level nav item. Full header height so the active underline sits on the header edge.
 */
export function MenuItem({
  setActive,
  active,
  item,
  href,
  hasDropdown,
  isActive = false,
  className,
  dropdownClassName,
  dropdownPanelClassName,
  children
}) {
  const hoverCtx = useContext(MenuHoverContext);
  const [isHovered, setIsHovered] = useState(false);
  const showDropdown = active === item && Boolean(children);
  const showHoverHighlight = isHovered || showDropdown;

  const triggerClassName = cn(
    "relative z-0 inline-flex h-full items-center gap-1.5 px-3.5 text-nowrap transition-colors duration-200 xl:px-4",
    isActive ? "text-secondary-dark" : showHoverHighlight ? "text-ink" : "text-ink/75",
    className
  );

  const triggerContent = (
    <>
      {showHoverHighlight ? (
        <HoverHighlight
          layoutId="nav-item-hover"
          className="inset-x-1.5 top-1/2 bottom-auto h-10 -translate-y-1/2 rounded-lg"
        />
      ) : null}
      {isActive ? <ActiveNavUnderline /> : null}
      <span className="relative">{item}</span>
      {hasDropdown ? (
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "relative size-3.5 shrink-0 opacity-45 transition duration-200",
            (showDropdown || isActive) && "opacity-70",
            isActive && "text-secondary-dark",
            showDropdown && "rotate-180"
          )}
        />
      ) : null}
    </>
  );

  return (
    <div className="relative flex h-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {hasDropdown && isPlaceholderHref(href) ? (
        <button type="button" aria-current={isActive ? "true" : undefined} className={triggerClassName} onMouseEnter={() => setActive(item)}>
          {triggerContent}
        </button>
      ) : (
        <NavAnchor
          href={href || "#"}
          aria-current={isActive ? "page" : undefined}
          className={triggerClassName}
          onMouseEnter={() => setActive(item)}
        >
          {triggerContent}
        </NavAnchor>
      )}

      {showDropdown ? (
        <div
          className={cn("absolute top-full left-1/2 z-50 -translate-x-1/2 pt-3", dropdownClassName)}
          onMouseEnter={() => hoverCtx?.registerHover?.()}
          onMouseLeave={() => hoverCtx?.unregisterHover?.()}
        >
          <motion.div
            layoutId="active"
            layoutScroll
            transition={transition}
            className={cn(
              "relative w-max min-w-52 overflow-visible rounded-2xl border border-line bg-white px-1.5 py-2 text-ink shadow-soft",
              dropdownPanelClassName
            )}
          >
            <MenuContext.Provider value={{ setActive, currentItem: item }}>{children}</MenuContext.Provider>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
