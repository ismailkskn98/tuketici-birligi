"use client";

import dynamic from "next/dynamic";
import { cloneElement, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getProvinceColor, matchesDensityFilter, PROVINCE_MAP_COLORS } from "./province-map-utils";

const TurkeyMap = dynamic(() => import("turkey-map-react"), { ssr: false });

export function ProvinceMapStage({
  compact = false,
  densityFilter,
  onProvinceOpen,
  provinceByCode
}) {
  const stageRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  function updateTooltip(event, city) {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    setTooltip({
      name: city.name,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

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
        onMouseEnter: (event) => {
          cityComponent.props.onMouseEnter?.(event);
          updateTooltip(event, city);
        },
        onMouseMove: (event) => {
          cityComponent.props.onMouseMove?.(event);
          updateTooltip(event, city);
        },
        onMouseLeave: (event) => {
          cityComponent.props.onMouseLeave?.(event);
          setTooltip(null);
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
    <section ref={stageRef} className="relative w-full min-w-0 overflow-x-clip py-1 text-ink">
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl min-w-0 place-items-center px-0 md:px-6 lg:px-8",
          compact ? "min-h-[12rem] sm:min-h-[14rem] md:min-h-[18rem] lg:min-h-[20rem] xl:min-h-[23rem]" : "min-h-[15rem] sm:min-h-[18rem] md:min-h-[22rem] lg:min-h-[26rem] xl:min-h-[29rem]",
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

      {tooltip ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 rounded-md border border-line bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink shadow-[0_6px_18px_rgba(22,32,51,0.08)]"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          {tooltip.name}
        </div>
      ) : null}
    </section>
  );
}
