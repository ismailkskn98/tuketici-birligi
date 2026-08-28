"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Sheet(props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-ink/15 transition-opacity duration-300 ease-out data-ending-style:opacity-0 data-ending-style:duration-200 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-[2px]",
        className,
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        className={cn(
          "fixed z-50 flex max-w-full flex-col bg-popover bg-clip-padding text-sm text-popover-foreground shadow-[-16px_0_48px_rgba(15,23,42,0.08)] outline-none will-change-transform",
          "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:duration-200 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-6 data-[side=bottom]:data-starting-style:translate-y-6",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:border-r data-[side=left]:data-ending-style:-translate-x-6 data-[side=left]:data-starting-style:-translate-x-6",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-6 data-[side=right]:data-starting-style:translate-x-6",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:-translate-y-6 data-[side=top]:data-starting-style:-translate-y-6",
          className,
        )}
        data-side={side}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={<Button aria-label="Paneli kapat" className="absolute right-3 top-3" size="icon-sm" variant="ghost" />}
          >
            <XIcon aria-hidden="true" />
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1 p-4", className)} data-slot="sheet-header" {...props} />;
}

function SheetFooter({ className, ...props }) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} data-slot="sheet-footer" {...props} />;
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      className={cn("font-heading text-base font-medium text-foreground", className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
