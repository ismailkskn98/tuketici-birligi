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

      const refreshDirectory = () => {
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      window.addEventListener("board-directory-change", refreshDirectory);

      animationContext = gsap.context(() => {
        const mastheadItems = root.querySelectorAll("[data-board-masthead-item]");
        const groups = root.querySelectorAll("[data-board-group]");
        const cards = root.querySelectorAll("[data-board-card-reveal]");

        gsap.fromTo(
          mastheadItems,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            clearProps: "opacity,transform,visibility",
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.08,
          },
        );

        groups.forEach((group) => {
          const groupCards = group.querySelectorAll("[data-board-card-reveal]");

          gsap.fromTo(
            groupCards,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              clearProps: "opacity,transform,visibility",
              duration: 0.68,
              ease: "power3.out",
              stagger: 0.07,
              scrollTrigger: {
                trigger: group,
                start: "top 84%",
                once: true,
              },
            },
          );
        });

        motionMediaQuery = gsap.matchMedia();
        motionMediaQuery.add("(min-width: 768px)", () => {
          cards.forEach((card) => {
            const portrait = card.querySelector("[data-board-portrait]");
            const distance = Number(portrait?.dataset.depth || 4);

            if (!portrait) return;

            gsap.fromTo(
              portrait,
              { yPercent: -distance },
              {
                yPercent: distance,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.9,
                },
              },
            );
          });
        });
      }, root);

      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("board-directory-change", refreshDirectory);
      };
    }

    let removeDirectoryListener;
    void prepareMotion().then((cleanup) => {
      removeDirectoryListener = cleanup;
    });

    return () => {
      cancelled = true;
      removeDirectoryListener?.();
      motionMediaQuery?.revert();
      animationContext?.revert();
    };
  }, []);

  return null;
}
