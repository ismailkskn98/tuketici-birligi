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
    <div className="rounded-xl border border-line/80 bg-white/72 p-4 transition duration-200 hover:border-primary-dark/25">
      <h3 className="font-heading text-[13px] font-bold tracking-normal text-ink">
        <Link className="focus-ring cursor-pointer rounded-sm transition-colors hover:text-secondary" href="/iletisim">
          {title}
        </Link>
      </h3>
      <ul className="mt-3 grid gap-3 text-sm leading-6 text-ink/70">
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
