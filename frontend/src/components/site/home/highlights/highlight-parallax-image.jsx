"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

function useParallaxEnabled() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setEnabled(!mobileQuery.matches && !coarseQuery.matches);
    };

    update();
    mobileQuery.addEventListener("change", update);
    coarseQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      coarseQuery.removeEventListener("change", update);
    };
  }, [prefersReducedMotion]);

  return enabled;
}

export function HighlightParallaxImage({ alt, priority, range = 16, sizes, src }) {
  const containerRef = useRef(null);
  const parallaxEnabled = useParallaxEnabled();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // travel = kart yüksekliğine göre istenen kayma (%).
  // translateY(%) elemanın kendi boyuna göre hesaplanır; bu yüzden
  // selfTravel, büyütülmüş katmana göre küçültülür — kenar boşluğu açılmaz.
  const travel = Math.max(6, range);
  const heightPercent = 100 + travel * 2;
  const selfTravel = (travel * 100) / heightPercent;
  const yRange = useMemo(() => [`-${selfTravel}%`, `${selfTravel}%`], [selfTravel]);
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  if (!parallaxEnabled) {
    return (
      <div className="absolute inset-0 bg-ink">
        <Image alt={alt} className="object-cover" fill priority={priority} sizes={sizes} src={src} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-ink">
      <motion.div
        className="absolute inset-x-0 w-full"
        style={{
          top: `-${travel}%`,
          height: `${heightPercent}%`,
          y,
        }}
      >
        <Image alt={alt} className="object-cover" fill priority={priority} sizes={sizes} src={src} />
      </motion.div>
    </div>
  );
}
