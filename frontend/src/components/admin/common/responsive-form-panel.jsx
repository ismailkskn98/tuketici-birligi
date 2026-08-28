"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const ResponsiveFormPanelContext = createContext({ isMobile: false });

function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}

export function ResponsiveFormPanel({
  children,
  description,
  drawerClassName,
  onOpenChange,
  open,
  panelClassName,
  title,
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ResponsiveFormPanelContext.Provider value={{ isMobile: true }}>
        <Drawer onOpenChange={onOpenChange} open={open} showSwipeHandle swipeDirection="down">
          <DrawerContent className={cn("max-h-[calc(100dvh-0.5rem)] w-full min-w-0 overflow-hidden bg-white [&>*]:min-w-0", drawerClassName)}>
            <DrawerTitle className="sr-only">{title}</DrawerTitle>
            <DrawerDescription className="sr-only">{description}</DrawerDescription>
            {children}
          </DrawerContent>
        </Drawer>
      </ResponsiveFormPanelContext.Provider>
    );
  }

  return (
    <ResponsiveFormPanelContext.Provider value={{ isMobile: false }}>
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent
          className={cn(
            "w-[min(84vw,72rem)] min-w-0 max-w-none gap-0 overflow-hidden bg-white [&>*]:min-w-0",
            panelClassName,
          )}
          side="right"
        >
          <SheetTitle className="sr-only">{title}</SheetTitle>
          <SheetDescription className="sr-only">{description}</SheetDescription>
          {children}
        </SheetContent>
      </Sheet>
    </ResponsiveFormPanelContext.Provider>
  );
}

export function ResponsiveFormPanelHeader({ className, description, eyebrow, title }) {
  const { isMobile } = useContext(ResponsiveFormPanelContext);
  const Title = isMobile ? DrawerTitle : SheetTitle;
  const Description = isMobile ? DrawerDescription : SheetDescription;

  return (
    <div className={cn("grid shrink-0 gap-1.5 border-b border-line bg-white px-5 py-5 pr-14 sm:px-7 sm:py-6", className)}>
      {eyebrow ? <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-primary">{eyebrow}</p> : null}
      <Title className="text-left text-xl font-semibold tracking-[-0.03em] text-ink">{title}</Title>
      {description ? (
        <Description className="max-w-2xl text-left text-sm leading-6 text-muted">{description}</Description>
      ) : null}
    </div>
  );
}
