"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const ExpandableScreenContext = createContext(null);

function useExpandableScreen() {
  const context = useContext(ExpandableScreenContext);
  if (!context) {
    throw new Error("useExpandableScreen must be used within an ExpandableScreen");
  }
  return context;
}

// Root Component

export function ExpandableScreen({
  children,
  defaultExpanded = false,
  onExpandChange,
  layoutId = "expandable-card",
  triggerRadius = "100px",
  contentRadius = "24px",
  animationDuration = 0.3,
  lockScroll = true,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const expand = () => {
    setIsExpanded(true);
    onExpandChange?.(true);
  };

  const collapse = () => {
    setIsExpanded(false);
    onExpandChange?.(false);
  };

  useEffect(() => {
    if (!lockScroll || !isExpanded) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isExpanded, lockScroll]);

  return (
    <ExpandableScreenContext.Provider
      value={{
        isExpanded,
        expand,
        collapse,
        layoutId,
        triggerRadius,
        contentRadius,
        animationDuration,
      }}
    >
      {children}
    </ExpandableScreenContext.Provider>
  );
}

// Trigger Component

export function ExpandableScreenTrigger({ children, className = "" }) {
  const { isExpanded, expand, layoutId, triggerRadius } = useExpandableScreen();

  return (
    <AnimatePresence initial={false}>
      {!isExpanded && (
        <motion.div className={`inline-block relative ${className}`}>
          {/* Background layer with shared layoutId for morphing */}
          <motion.div
            style={{
              borderRadius: triggerRadius,
            }}
            layout
            layoutId={layoutId}
            className="absolute inset-0 transform-gpu will-change-transform"
          />
          {/* Content layer that fades out on expand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout={false}
            onClick={expand}
            className="relative cursor-pointer"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Content Component

export function ExpandableScreenContent({ children, className = "", showCloseButton = true, closeButtonClassName = "" }) {
  const { isExpanded, collapse, layoutId, contentRadius, animationDuration } = useExpandableScreen();

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <div className="fixed inset-0 z-99 overflow-hidden p-3 sm:p-8">
          {/* Morphing background with shared layoutId */}
          <motion.div
            layoutId={layoutId}
            transition={{ duration: animationDuration }}
            style={{
              borderRadius: contentRadius,
            }}
            layout
            className={`relative h-full w-full overflow-y-auto overscroll-contain transform-gpu will-change-transform border border-gray-200 rounded-3xl shadow-xs ${className}`}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }} className="relative z-20 min-h-full w-full rounded-3xl">
              {children}
            </motion.div>
            {showCloseButton && (
              <motion.button
                onClick={collapse}
                className={`absolute right-6 top-6 z-30 flex h-10 w-10 cursor-pointer items-center justify-center transition-colors rounded-full ${
                  closeButtonClassName || "text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                }`}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Background Component (optional)

export function ExpandableScreenBackground({ trigger, content, className = "" }) {
  const { isExpanded } = useExpandableScreen();

  if (isExpanded && content) {
    return <div className={className}>{content}</div>;
  }

  if (!isExpanded && trigger) {
    return <div className={className}>{trigger}</div>;
  }

  return null;
}

export { useExpandableScreen };
