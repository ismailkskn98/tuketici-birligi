"use client";

import { useEffect } from "react";

export function BoardMembersMotion() {
  useEffect(() => {
    const root = document.querySelector("[data-board-motion-root]");

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let cancelled = false;
    let animationContext;
    let motionMediaQuery;

    async function prepareMotion() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      animationContext = gsap.context(() => {
        const mastheadItems = root.querySelectorAll("[data-board-masthead-item]");
        const cards = root.querySelectorAll("[data-board-card-reveal]");

        gsap.fromTo(
          mastheadItems,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            clearProps: "opacity,transform,visibility",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.09,
          },
        );

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              clearProps: "opacity,transform,visibility",
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

        motionMediaQuery = gsap.matchMedia();
        motionMediaQuery.add("(min-width: 768px)", () => {
          cards.forEach((card, index) => {
            const cardDepth = card.querySelector("[data-board-card-depth]");
            const portrait = card.querySelector("[data-board-portrait]");
            const cardDistance = 8;
            const portraitDistance = 2.5 + (index % 2) * 0.75;

            gsap.fromTo(
              cardDepth,
              { y: cardDistance },
              {
                y: -cardDistance,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.85,
                },
              },
            );

            gsap.fromTo(
              portrait,
              { yPercent: -portraitDistance },
              {
                yPercent: portraitDistance,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.85,
                },
              },
            );
          });

        });
      }, root);

      ScrollTrigger.refresh();
    }

    void prepareMotion();

    return () => {
      cancelled = true;
      motionMediaQuery?.revert();
      animationContext?.revert();
    };
  }, []);

  return null;
}
