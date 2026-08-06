"use client";

import dynamic from "next/dynamic";
import { cloneElement } from "react";
import { cn } from "@/lib/utils";
import { getProvinceColor, matchesDensityFilter, PROVINCE_MAP_COLORS } from "./province-map-utils";

const TurkeyMap = dynamic(() => import("turkey-map-react"), { ssr: false });

export function ProvinceMapStage({
  compact = false,
  densityFilter,
  onProvinceOpen,
  provinceByCode
}) {
  function renderCity(cityComponent, city) {
    const province = provinceByCode.get(Number(city.plateNumber));
    const count = province?.count || 0;
    const matches = matchesDensityFilter(count, densityFilter);
    const fill = matches ? getProvinceColor(count) : PROVINCE_MAP_COLORS.empty;
    const path = cityComponent.props.children;

    return cloneElement(
      cityComponent,
      {
        "aria-label": `${city.name}: ${count} kayıt`,
        className: "outline-none",
        onKeyDown: (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onProvinceOpen(city.plateNumber, city.name);
        },
        onMouseLeave: (event) => {
          cityComponent.props.onMouseLeave?.(event);
          const cityPath = event.currentTarget.querySelector("path");
          if (cityPath) {
            cityPath.style.fill = fill;
            cityPath.style.opacity = matches ? "1" : "0.45";
          }
        },
        role: "button",
        tabIndex: 0,
      },
      cloneElement(path, {
        style: {
          ...path.props.style,
          cursor: "pointer",
          fill,
          opacity: matches ? 1 : 0.45,
          stroke: "#ffffff",
          strokeLinejoin: "round",
          strokeWidth: 1.2,
          transition: "fill 180ms ease, opacity 180ms ease, stroke 180ms ease",
        },
      }),
    );
  }

  return (
    <section className="relative w-full min-w-0 overflow-hidden py-1 text-ink">
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl min-w-0 place-items-center px-0 md:px-8",
          compact ? "min-h-[14rem] md:min-h-[23rem]" : "min-h-[18rem] md:min-h-[29rem]"
        )}
      >
        <div className="province-map-svg-shell w-full max-w-full min-w-0">
          <TurkeyMap
            cityWrapper={renderCity}
            customStyle={{ hoverColor: PROVINCE_MAP_COLORS.hover, idleColor: PROVINCE_MAP_COLORS.empty }}
            hoverable
            onClick={(city) => onProvinceOpen(city.plateNumber, city.name)}
            showTooltip={false}
          />
        </div>
      </div>
    </section>
  );
}
