"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export function HeaderChrome2({ children, className }) {
  const barRef = useRef(null);

  return (
    <div className={cn("pointer-events-none", className)}>
      <div className="gridContainer pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-end">
          <div ref={barRef} className="w-full rounded-xl bg-white text-ink">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
