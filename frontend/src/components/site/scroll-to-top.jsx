"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { ScrollTopLogo } from "@/components/common/scrollTopLogo";

const SHOW_AFTER = 480;

export function ScrollToTop() {
  const t = useTranslations("Footer");
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <motion.button
      aria-hidden={!visible}
      aria-label={t("backToTop")}
      tabIndex={visible ? 0 : -1}
      type="button"
      onClick={scrollToTop}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 6,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group fixed right-5 bottom-5 z-9999",
        "flex size-12 items-center justify-center",
        "appearance-none border-0 bg-transparent p-0",
        "outline-none ring-0 shadow-none",
        "focus:outline-none focus:ring-0 focus:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        "sm:right-8 sm:bottom-8 sm:size-14",
        visible ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <ScrollTopLogo className="pointer-events-none size-11 sm:size-12" visible={visible} />
    </motion.button>
  );
}
