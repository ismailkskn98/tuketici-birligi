"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const ResponsiveModalContext = createContext({ isMobile: false });

export function useIsMobile(query = "(max-width: 639px)") {
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

export function useResponsiveModal() {
  return useContext(ResponsiveModalContext);
}

export function ResponsiveModal({
  children,
  description,
  dialogClassName,
  drawerClassName,
  hideTitle = false,
  onOpenChange,
  open,
  showCloseButton = true,
  showSwipeHandle = true,
  title,
}) {
  const isMobile = useIsMobile();

  const labelledTitle = hideTitle ? (
    isMobile ? (
      <DrawerTitle className="sr-only">{title}</DrawerTitle>
    ) : (
      <DialogTitle className="sr-only">{title}</DialogTitle>
    )
  ) : null;

  const labelledDescription = hideTitle && description ? (
    isMobile ? (
      <DrawerDescription className="sr-only">{description}</DrawerDescription>
    ) : (
      <DialogDescription className="sr-only">{description}</DialogDescription>
    )
  ) : null;

  if (isMobile) {
    return (
      <ResponsiveModalContext.Provider value={{ isMobile: true }}>
        <Drawer onOpenChange={onOpenChange} open={open} showSwipeHandle={showSwipeHandle} swipeDirection="down">
          <DrawerContent className={cn("bg-white", drawerClassName)}>
            {labelledTitle}
            {labelledDescription}
            {children}
          </DrawerContent>
        </Drawer>
      </ResponsiveModalContext.Provider>
    );
  }

  return (
    <ResponsiveModalContext.Provider value={{ isMobile: false }}>
      <Dialog onOpenChange={onOpenChange} open={open}>
        <DialogContent className={dialogClassName} showCloseButton={showCloseButton}>
          {labelledTitle}
          {labelledDescription}
          {children}
        </DialogContent>
      </Dialog>
    </ResponsiveModalContext.Provider>
  );
}

export function ResponsiveModalHeader({ className, description, title }) {
  const { isMobile } = useResponsiveModal();
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;

  return (
    <div className={cn("grid gap-1.5 px-6 pb-2 pt-5 text-left sm:px-7 sm:pt-6", className)}>
      <Title className="text-left text-[1.05rem] font-semibold tracking-tight text-ink">{title}</Title>
      {description ? <Description className="max-w-xl text-left text-sm leading-6 text-muted">{description}</Description> : null}
    </div>
  );
}
