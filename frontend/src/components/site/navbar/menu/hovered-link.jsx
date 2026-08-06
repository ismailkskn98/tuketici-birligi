"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HoverHighlight } from "./hover-highlight";
import { NavAnchor } from "./shared";

/**
 * Simple link inside a dropdown.
 */
export function HoveredLink({ children, className, href, isActive = false, highlightId = "dropdown-hover", ...rest }) {
  const [hovered, setHovered] = useState(false);

  return (
    <NavAnchor
      href={href}
      aria-current={isActive ? "page" : undefined}
      {...rest}
      className={cn("relative z-0 block px-4 py-2.5 text-nowrap transition-colors duration-200", isActive ? "text-secondary-dark" : hovered ? "text-ink" : "text-ink/75", className)}
      onMouseEnter={(event) => {
        setHovered(true);
        rest.onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        rest.onMouseLeave?.(event);
      }}
    >
      {hovered ? <HoverHighlight layoutId={highlightId} className="rounded-lg" /> : null}
      <span className="relative">{children}</span>
    </NavAnchor>
  );
}
