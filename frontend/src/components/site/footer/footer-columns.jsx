import { Link } from "@/i18n/navigation";
import { FooterLink, isPlaceholderHref } from "./footer-link";

export function FooterColumn({ title, href, links }) {
  return (
    <div className="group/column">
      <h3 className="font-heading text-[13px] font-bold tracking-normal text-ink">
        {isPlaceholderHref(href) ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary/45 transition-colors duration-200 group-hover/column:bg-secondary" />
            {title}
          </span>
        ) : (
          <Link
            className="focus-ring group/title relative inline-flex cursor-pointer items-center gap-2 rounded-sm transition-colors hover:text-secondary"
            href={href}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-secondary/45 transition-colors duration-200 group-hover/title:bg-secondary" />
            {title}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-secondary/70 transition-transform duration-300 group-hover/title:scale-x-100"
            />
          </Link>
        )}
      </h3>
      <ul className="mt-2.5 grid gap-1 sm:mt-3 sm:gap-1.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterColumns({ columns }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 md:gap-x-5 md:gap-y-9 lg:grid-cols-4 lg:gap-x-5 xl:grid-cols-6 xl:gap-x-5 2xl:gap-x-6 2xl:gap-y-10">
      {columns.map((column) => (
        <FooterColumn href={column.href} key={column.title} links={column.links} title={column.title} />
      ))}
    </div>
  );
}
