import { Link } from "@/i18n/navigation";
import { DrawerClose } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

function isPlaceholderHref(href) {
  return !href || href === "#";
}

export function MobileLink({ href, children, className }) {
  if (isPlaceholderHref(href)) {
    return (
      <span aria-disabled="true" className={cn("cursor-default text-muted", className)}>
        {children}
      </span>
    );
  }

  return (
    <DrawerClose nativeButton={false} render={<Link className={className} href={href} />}>
      {children}
    </DrawerClose>
  );
}
