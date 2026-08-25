"use client";

export function EdgeBlur({ position = "bottom", height = 75 }) {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 z-40 ${isTop ? "top-0 bg-linear-to-b from-white to-transparent" : "bottom-0 bg-linear-to-t from-white to-transparent"}`}
      style={{ height }}
    />
  );
}

export function TopBlur({ height = 75 }) {
  return <EdgeBlur height={height} position="top" />;
}

export function BottomBlur({ height = 75 }) {
  return <EdgeBlur height={height} position="bottom" />;
}
