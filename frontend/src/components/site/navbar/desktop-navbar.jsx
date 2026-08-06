"use client";

import { useMemo, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { findActiveNavTrail } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { HoveredLink, Menu, MenuItem, NestedHoveredLink } from "./menu";

/**
 * Data-driven desktop navbar built on menu primitives.
 * Active route trail is highlighted with secondary from top → dropdown → submenu.
 */
export function DesktopNavbar({
  items = [],
  linkComponent,
  className,
  menuClassName,
  itemClassName,
  dropdownClassName,
  dropdownPanelClassName,
  linkClassName,
  nestedLinkClassName,
  submenuClassName
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(null);
  const trail = useMemo(() => findActiveNavTrail(items, pathname), [items, pathname]);

  return (
    <nav
      aria-label="Ana menü"
      className={cn("flex h-full w-full min-w-0 items-stretch justify-center font-sans text-[12px] font-medium text-nowrap text-ink xl:text-[13px] 2xl:text-sm", className)}
    >
      <Menu setActive={setActive} linkComponent={linkComponent} className={cn("h-full min-w-0 gap-0 xl:gap-1 2xl:gap-1.5", menuClassName)}>
        {items.map((entry) => {
          const hasDropdown = Array.isArray(entry.links) && entry.links.length > 0;
          const isTopActive = trail?.topItem === entry.item;

          return (
            <MenuItem
              key={entry.item}
              setActive={setActive}
              active={active}
              item={entry.item}
              href={entry.href}
              hasDropdown={hasDropdown}
              isActive={isTopActive}
              className={cn("cursor-pointer", itemClassName)}
              dropdownClassName={dropdownClassName}
              dropdownPanelClassName={dropdownPanelClassName}
            >
              {hasDropdown ? (
                <div className="flex flex-col gap-0.5 py-0.5 font-sans text-sm">
                  {entry.links.map((link, idx) => {
                    const isLinkActive = isTopActive && trail?.linkLabel === link.label;

                    if (link.submenu?.length) {
                      return (
                        <NestedHoveredLink
                          key={`${link.label}-${idx}`}
                          href={link.href}
                          isActive={isLinkActive}
                          className={nestedLinkClassName}
                          submenuClassName={submenuClassName}
                          submenu={
                            <>
                              {link.submenu.map((sub, sidx) => (
                                <HoveredLink
                                  key={`${sub.label}-${sidx}`}
                                  href={sub.href}
                                  isActive={isLinkActive && trail?.subLabel === sub.label}
                                  highlightId="submenu-hover"
                                  className={linkClassName}
                                >
                                  {sub.label}
                                </HoveredLink>
                              ))}
                            </>
                          }
                        >
                          {link.label}
                        </NestedHoveredLink>
                      );
                    }

                    return (
                      <HoveredLink
                        key={`${link.label}-${idx}`}
                        href={link.href}
                        isActive={isLinkActive}
                        className={linkClassName}
                      >
                        {link.label}
                      </HoveredLink>
                    );
                  })}
                </div>
              ) : null}
            </MenuItem>
          );
        })}
      </Menu>
    </nav>
  );
}
