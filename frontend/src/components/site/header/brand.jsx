"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { MainLogo } from "@/components/common/mainLogo";

export function HeaderBrand({ shortName, tagline }) {
  const [logoKey, setLogoKey] = useState(0);

  return (
    <Link className="focus-ring flex min-w-0 items-center gap-2 rounded-[8px]" href="/" onMouseEnter={() => setLogoKey((prev) => prev + 1)}>
      <MainLogo key={logoKey} className="size-14 shrink-0 sm:size-16 md:size-[4.5rem]" drawOnMount drawDuration={3.2} />

      <span className="grid min-w-0">
        <span className="truncate font-heading text-base font-medium leading-tight tracking-tight text-[#870b18]">{shortName}</span>
      </span>
    </Link>
  );
}
