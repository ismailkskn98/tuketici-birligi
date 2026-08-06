"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function Command({ className, ...props }) {
  return <CommandPrimitive data-slot="command" className={cn("flex size-full flex-col overflow-hidden bg-white text-ink", className)} {...props} />;
}

function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, className, showCloseButton = false, ...props }) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn("top-[min(20vh,8rem)] translate-y-0 gap-0 overflow-hidden rounded-2xl border border-line bg-white p-0 shadow-soft ring-0 sm:max-w-xl", className)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }) {
  return (
    <div data-slot="command-input-wrapper" className="flex items-center gap-3 border-b border-line/50 px-5 sm:px-6">
      <SearchIcon className="size-4 shrink-0 text-muted" strokeWidth={1.5} aria-hidden="true" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-14 w-full bg-transparent font-sans text-[15px] text-ink outline-hidden placeholder:text-muted focus:outline-hidden focus-visible:outline-hidden focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }) {
  return <CommandPrimitive.List data-slot="command-list" className={cn("max-h-[min(22rem,50vh)] scroll-py-2 overflow-x-hidden overflow-y-auto p-2 outline-hidden", className)} {...props} />;
}

function CommandEmpty({ className, ...props }) {
  return <CommandPrimitive.Empty data-slot="command-empty" className={cn("py-10 text-center font-sans text-sm text-muted", className)} {...props} />;
}

function CommandGroup({ className, ...props }) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden text-ink [[cmdk-group-heading]]:**:px-2.5 [[cmdk-group-heading]]:**:pb-2 [[cmdk-group-heading]]:**:pt-1.5 [[cmdk-group-heading]]:**:font-heading [[cmdk-group-heading]]:**:text-[11px] [[cmdk-group-heading]]:**:font-semibold [[cmdk-group-heading]]:**:uppercase [[cmdk-group-heading]]:**:tracking-[0.08em] [[cmdk-group-heading]]:**:text-muted",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }) {
  return <CommandPrimitive.Separator data-slot="command-separator" className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

function CommandItem({ className, children, ...props }) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 font-sans text-sm text-ink outline-hidden select-none transition-colors data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-surface data-[selected=true]:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  );
}

function CommandShortcut({ className, ...props }) {
  return <span data-slot="command-shortcut" className={cn("ml-auto font-sans text-[11px] tracking-wide text-muted", className)} {...props} />;
}

export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator };
