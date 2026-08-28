"use client";

import * as React from "react";
import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const toast = ToastPrimitive.createToastManager();

function ToastProvider(props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal(props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }) {
  return (
    <ToastPrimitive.Viewport
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-[100] mx-auto w-auto max-w-sm outline-none sm:left-auto sm:right-4 sm:mx-0 sm:w-full",
        className,
      )}
      data-slot="toast-viewport"
      {...props}
    />
  );
}

function Toast({ className, ...props }) {
  return (
    <ToastPrimitive.Root
      className={cn(
        "group/toast pointer-events-auto absolute bottom-0 right-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-xl border border-border bg-popover text-popover-foreground shadow-[0_16px_48px_rgba(17,24,39,0.16)] outline-none ring-1 ring-black/[0.025] will-change-transform focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.625rem] [--scale:calc(max(0,1-(var(--toast-index)*0.08)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_320ms_cubic-bezier(0.22,1,0.36,1),opacity_240ms,height_150ms]",
        "after:absolute after:left-0 after:top-full after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))] data-limited:opacity-0 data-starting-style:[transform:translateY(130%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(130%)] data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+130%))] data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-130%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+130%))_translateY(var(--offset-y))] data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-130%))]",
        className,
      )}
      data-slot="toast"
      {...props}
    />
  );
}

function ToastContent({ className, ...props }) {
  return (
    <ToastPrimitive.Content
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-200 data-behind:opacity-0 data-expanded:opacity-100",
        className,
      )}
      data-slot="toast-content"
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }) {
  return <ToastPrimitive.Title className={cn("text-sm font-semibold", className)} data-slot="toast-title" {...props} />;
}

function ToastDescription({ className, ...props }) {
  return (
    <ToastPrimitive.Description
      className={cn("text-sm leading-5 text-muted-foreground", className)}
      data-slot="toast-description"
      {...props}
    />
  );
}

function ToastAction({ className, render = <Button size="sm" variant="outline" />, ...props }) {
  return <ToastPrimitive.Action className={cn("shrink-0", className)} data-slot="toast-action" render={render} {...props} />;
}

function ToastClose({ className, children, render = <Button size="icon-sm" variant="ghost" />, ...props }) {
  return (
    <ToastPrimitive.Close
      aria-label="Bildirimi kapat"
      className={cn("relative shrink-0 text-muted-foreground hover:text-foreground", className)}
      data-slot="toast-close"
      render={render}
      {...props}
    >
      {children || <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

const toastIcons = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: OctagonXIcon,
  loading: Loader2Icon,
};

function ToastIcon({ type }) {
  const Icon = toastIcons[type];
  if (!Icon) return null;

  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full bg-surface text-primary [&_svg]:size-4",
        type === "success" && "bg-wheat/10 text-wheat",
        type === "warning" && "bg-secondary/10 text-secondary-dark",
        type === "error" && "bg-destructive/10 text-destructive",
      )}
      data-slot="toast-icon"
    >
      <Icon aria-hidden="true" className={type === "loading" ? "animate-spin" : undefined} />
    </span>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({ children, toastManager = toast, ...props }) {
  return (
    <ToastProvider limit={4} toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  createToastManager,
  toast,
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToastManager,
};
