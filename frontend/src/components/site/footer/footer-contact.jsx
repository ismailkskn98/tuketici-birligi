import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";

function ContactItem({ children, icon: Icon }) {
  return (
    <li className="group/contact flex gap-2.5">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary transition duration-200 group-hover/contact:-translate-y-px group-hover/contact:text-primary-dark" strokeWidth={1.8} />
      <span>{children}</span>
    </li>
  );
}

export function FooterContact({ settings, title }) {
  return (
    <div className="rounded-xl border border-line/80 bg-white/72 p-3.5 transition duration-200 hover:border-primary-dark/25 sm:p-4 md:p-3.5 lg:p-4">
      <h3 className="font-heading text-[13px] font-bold tracking-normal text-ink">
        <Link className="focus-ring cursor-pointer rounded-sm transition-colors hover:text-secondary" href="/iletisim">
          {title}
        </Link>
      </h3>
      <ul className="mt-2.5 grid gap-2.5 text-[13px] leading-5 text-ink/70 sm:mt-3 sm:gap-3 sm:text-sm sm:leading-6 md:gap-2.5 md:text-[13px] md:leading-5 lg:gap-3 lg:text-sm lg:leading-6">
        <ContactItem icon={MapPin}>{settings.address}</ContactItem>
        <ContactItem icon={Phone}>{settings.phone}</ContactItem>
        <ContactItem icon={Mail}>
          <a className="focus-ring cursor-pointer rounded-sm transition-colors hover:text-secondary" href={`mailto:${settings.email}`}>
            {settings.email}
          </a>
        </ContactItem>
      </ul>
    </div>
  );
}
