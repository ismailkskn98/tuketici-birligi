"use client";

import { createContext, createElement, useContext } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001
};

/** Snappier spring for sliding hover pills (less “floaty”). */
export const hoverTransition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.6
};

export const MenuContext = createContext({ setActive: () => {}, currentItem: null });
export const MenuHoverContext = createContext({
  registerHover: () => {},
  unregisterHover: () => {}
});
export const NavbarLinkContext = createContext(Link);

export function useNavbarLink() {
  return useContext(NavbarLinkContext);
}

export function isPlaceholderHref(href) {
  return !href || href === "#";
}

export function NavAnchor({ href, className, children, ...rest }) {
  const NavLink = useNavbarLink();

  if (isPlaceholderHref(href)) {
    return (
      <span
        aria-disabled="true"
        className={cn("cursor-default", className)}
        role="link"
        {...rest}
      >
        {children}
      </span>
    );
  }

  return createElement(
    NavLink,
    {
      className,
      href,
      prefetch: true,
      ...rest
    },
    children
  );
}
