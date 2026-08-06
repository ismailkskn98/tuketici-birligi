"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MenuHoverContext, NavbarLinkContext } from "./shared";

/**
 * Root hover coordinator. Keeps dropdowns open while the pointer
 * moves between the trigger and nested panels.
 */
export function Menu({ setActive, children, className, linkComponent }) {
  const hoverCount = useRef(0);
  const leaveTimeout = useRef(null);
  const LinkComponent = linkComponent || Link;

  useEffect(() => {
    return () => {
      if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    };
  }, []);

  const registerHover = () => {
    hoverCount.current += 1;
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }
  };

  const unregisterHover = () => {
    hoverCount.current = Math.max(0, hoverCount.current - 1);
    if (hoverCount.current === 0) {
      leaveTimeout.current = setTimeout(() => setActive(null), 180);
    }
  };

  return (
    <NavbarLinkContext.Provider value={LinkComponent}>
      <MenuHoverContext.Provider value={{ registerHover, unregisterHover }}>
        <div
          className={cn("relative flex h-full items-stretch justify-center", className)}
          onMouseEnter={registerHover}
          onMouseLeave={unregisterHover}
        >
          {children}
        </div>
      </MenuHoverContext.Provider>
    </NavbarLinkContext.Provider>
  );
}
