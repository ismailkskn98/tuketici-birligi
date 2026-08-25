"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { MainLogo } from "@/components/common/mainLogo";

export function HeaderBrand({ shortName }) {
  const [logoKey, setLogoKey] = useState(0);

  return (
    <Link
      className="focus-ring flex min-w-0 max-w-full items-center gap-1.5 rounded-[8px] sm:gap-2 lg:gap-1.5 xl:gap-2.5"
      href="/"
      onMouseEnter={() => setLogoKey((prev) => prev + 1)}
    >
      <MainLogo
        key={logoKey}
        className="size-10 shrink-0 sm:size-12 md:size-12 lg:size-10 xl:size-14 2xl:size-16"
        drawOnMount
      />

      <span className="grid min-w-0">
        <span className="truncate font-heading text-[0.8125rem] font-medium leading-tight tracking-tight text-ink sm:text-sm lg:max-w-[8.5rem] lg:text-[0.8125rem] xl:max-w-[11rem] xl:text-[0.9375rem] 2xl:max-w-none 2xl:text-base">
          {shortName}
        </span>
      </span>
    </Link>
  );
}
