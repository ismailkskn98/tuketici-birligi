"use client";

import { useContext, useState } from "react";
import { motion } from "motion/react";
import { HiChevronRight } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { HoverHighlight } from "./hover-highlight";
import { MenuContext, MenuHoverContext, NavAnchor, transition } from "./shared";

/**
 * Dropdown link that opens a nested (flyout) submenu on hover.
 */
export function NestedHoveredLink({
  children,
  className,
  submenu,
  submenuClassName,
  href,
  isActive = false,
  highlightId = "dropdown-hover",
  ...rest
}) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [hovered, setHovered] = useState(false);
  const menuCtx = useContext(MenuContext);
  const hoverCtx = useContext(MenuHoverContext);
  const { setActive: setMenuActive, currentItem } = menuCtx || {};
  const { registerHover, unregisterHover } = hoverCtx || {};

  const open = () => {
    registerHover?.();
    setShowSubmenu(true);
    setHovered(true);
    if (setMenuActive && currentItem) setMenuActive(currentItem);
  };

  const close = () => {
    setShowSubmenu(false);
    setHovered(false);
    unregisterHover?.();
  };

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={close}>
      <NavAnchor
        href={href}
        aria-current={isActive ? "true" : undefined}
        className={cn(
          "group relative z-0 flex items-center justify-between gap-6 px-4 py-2.5 text-nowrap transition-colors duration-200",
          isActive ? "text-secondary-dark" : hovered ? "text-ink" : "text-ink/75",
          className
        )}
        {...rest}
      >
        {hovered ? <HoverHighlight layoutId={highlightId} className="rounded-lg" /> : null}
        <span className="relative">{children}</span>
        {submenu ? (
          <HiChevronRight
            aria-hidden="true"
            className={cn(
              "relative size-3.5 shrink-0 opacity-45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-70",
              isActive && "text-secondary-dark opacity-70"
            )}
          />
        ) : null}
      </NavAnchor>

      {submenu && showSubmenu ? (
        <div className="absolute top-0 left-full z-60 min-w-52 pl-2" onMouseEnter={open} onMouseLeave={close}>
          <motion.div
            layoutScroll
            initial={{ x: 6 }}
            animate={{ x: 0 }}
            transition={transition}
            className={cn("overflow-visible rounded-2xl border border-line bg-white py-2 shadow-soft", submenuClassName)}
          >
            <div className="flex flex-col gap-0.5 px-1.5">
              {/* Submenu uses its own highlight id so it doesn’t fight the parent list. */}
              {submenu}
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
