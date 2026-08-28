"use client";

import { useEffect } from "react";

const entranceKeyframes = (offset) => [
  {
    opacity: 0,
    transform: `translate3d(0, ${offset}px, 0)`,
  },
  {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
];

export function BoardMembersMotion() {
  useEffect(() => {
    const root = document.querySelector("[data-board-motion-root]");

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const mastheadItems = root.querySelectorAll("[data-board-masthead-item]");
    const cards = root.querySelectorAll("[data-board-card-reveal]");
    const animations = [];

    mastheadItems.forEach((item, index) => {
      animations.push(
        item.animate(entranceKeyframes(14), {
          duration: 620,
          delay: index * 70,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        }),
      );
    });

    cards.forEach((card, index) => {
      animations.push(
        card.animate(entranceKeyframes(18), {
          duration: 560,
          delay: 140 + Math.min(index, 8) * 45,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        }),
      );
    });

    return () => {
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return null;
}
