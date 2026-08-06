"use client";

import { Link } from "@/i18n/navigation";
import { navigationMenu } from "@/lib/navigation";
import { DesktopNavbar } from "./desktop-navbar";

export function SiteNavbar() {
  return <DesktopNavbar items={navigationMenu} linkComponent={Link} />;
}

export { DesktopNavbar } from "./desktop-navbar";
export {
  Menu,
  MenuItem,
  HoveredLink,
  NestedHoveredLink
} from "./menu";
