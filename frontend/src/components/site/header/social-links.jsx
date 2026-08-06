import { Facebook, Instagram, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

function XIcon({ className }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export function buildSocialItems(settings) {
  const links = settings.socialLinks || {};

  return [
    { href: links.facebook || null, label: "Facebook", icon: Facebook },
    { href: links.x || null, label: "X", icon: XIcon },
    { href: links.instagram || null, label: "Instagram", icon: Instagram },
    { href: links.youtube || null, label: "YouTube", icon: Youtube },
  ];
}

function SocialLink({ href, label, icon: Icon, tone = "light", iconClassName }) {
  const className = cn(
    "focus-ring inline-flex cursor-pointer items-center justify-center p-1 transition-colors duration-200",
    tone === "dark" ? "text-ink/45 hover:text-ink" : "text-white/50 hover:text-white",
  );

  const icon = <Icon aria-hidden="true" className={cn("size-3.5", iconClassName)} size={14} strokeWidth={1.75} />;

  if (!href) {
    return (
      <span aria-label={label} className={className} title={label}>
        {icon}
      </span>
    );
  }

  return (
    <a aria-label={label} className={className} href={href} rel="noreferrer" target="_blank">
      {icon}
    </a>
  );
}

export function SocialLinks({ settings, tone = "light", className, iconClassName }) {
  const socials = buildSocialItems(settings);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socials.map((item) => (
        <SocialLink href={item.href} icon={item.icon} iconClassName={iconClassName} key={item.label} label={item.label} tone={tone} />
      ))}
    </div>
  );
}
