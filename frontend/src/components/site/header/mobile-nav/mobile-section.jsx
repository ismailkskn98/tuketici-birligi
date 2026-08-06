"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { findActiveNavTrail } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MobileLink } from "./mobile-link";

function AccordionPanel({ children, open }) {
  return (
    <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function MobileSubgroup({ link, isTopActive, trail }) {
  const hasSubmenu = Array.isArray(link.submenu) && link.submenu.length > 0;
  const isLinkActive = isTopActive && trail?.linkLabel === link.label;
  const [open, setOpen] = useState(isLinkActive);

  if (!hasSubmenu) {
    return (
      <MobileLink
        className={cn(
          "focus-ring flex min-h-11 items-center py-2 text-[15px] font-medium text-ink/80 transition hover:text-ink",
          isLinkActive && "text-secondary-dark",
        )}
        href={link.href}
      >
        {link.label}
      </MobileLink>
    );
  }

  return (
    <div>
      <button
        aria-expanded={open}
        className={cn(
          "focus-ring flex min-h-11 w-full items-center justify-between gap-3 py-2 text-left text-[15px] font-medium text-ink/80 transition hover:text-ink",
          isLinkActive && "text-secondary-dark",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {link.label}
        <ChevronDown aria-hidden="true" className={cn("size-4 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")} strokeWidth={1.75} />
      </button>

      <AccordionPanel open={open}>
        <div className="mb-2 grid border-l border-line/80 pl-3">
          {link.submenu.map((sub) => {
            const isSubActive = isLinkActive && trail?.subLabel === sub.label;

            return (
              <MobileLink
                className={cn(
                  "focus-ring flex min-h-10 items-center py-1.5 text-sm text-muted transition hover:text-ink",
                  isSubActive && "text-secondary-dark",
                )}
                href={sub.href}
                key={sub.label}
              >
                {sub.label}
              </MobileLink>
            );
          })}
        </div>
      </AccordionPanel>
    </div>
  );
}

export function MobileSection({ entry }) {
  const pathname = usePathname();
  const trail = useMemo(() => findActiveNavTrail(undefined, pathname), [pathname]);
  const isTopActive = trail?.topItem === entry.item;
  const [open, setOpen] = useState(isTopActive);
  const hasDropdown = Array.isArray(entry.links) && entry.links.length > 0;

  if (!hasDropdown) {
    return (
      <MobileLink
        className={cn(
          "focus-ring flex min-h-14 items-center border-b border-line/70 py-4 font-heading text-[1.65rem] font-semibold leading-none tracking-tight text-ink transition hover:text-secondary-dark",
          isTopActive && "text-secondary-dark",
        )}
        href={entry.href}
      >
        {entry.item}
      </MobileLink>
    );
  }

  return (
    <div className="border-b border-line/70">
      <button
        aria-expanded={open}
        className={cn(
          "focus-ring flex min-h-14 w-full items-center justify-between gap-3 py-4 text-left font-heading text-[1.65rem] font-semibold leading-none tracking-tight text-ink transition hover:text-secondary-dark",
          isTopActive && "text-secondary-dark",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {entry.item}
        <ChevronDown aria-hidden="true" className={cn("size-5 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")} strokeWidth={1.6} />
      </button>

      <AccordionPanel open={open}>
        <div className="grid gap-0.5 pb-4">
          {entry.links.map((link) => (
            <MobileSubgroup isTopActive={isTopActive} key={link.label} link={link} trail={trail} />
          ))}
        </div>
      </AccordionPanel>
    </div>
  );
}
