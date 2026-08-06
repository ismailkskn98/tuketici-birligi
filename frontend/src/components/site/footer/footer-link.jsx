import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function isPlaceholderHref(href) {
  return !href || href === "#";
}

export function FooterLink({ href, children, className }) {
  const styles = cn(
    "group/link relative inline-flex w-fit rounded-sm text-sm leading-6 text-ink/68 transition duration-200 hover:-translate-y-px hover:text-secondary",
    "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-secondary/70 after:transition-transform after:duration-300 hover:after:scale-x-100",
    className
  );

  if (isPlaceholderHref(href)) {
    return (
      <span aria-disabled="true" className={cn(styles, "cursor-default opacity-70 hover:translate-y-0 hover:text-ink/70 hover:after:scale-x-0")}>
        {children}
      </span>
    );
  }

  return (
    <Link className={cn("focus-ring cursor-pointer", styles)} href={href}>
      {children}
    </Link>
  );
}
