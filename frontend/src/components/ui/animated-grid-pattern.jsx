"use client";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}) {
  const id = useId()
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [iterations, setIterations] = useState({})
  const squares = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return []

    const columns = Math.max(1, Math.floor(dimensions.width / width))
    const rows = Math.max(1, Math.floor(dimensions.height / height))

    return Array.from({ length: numSquares }, (_, squareId) => {
      const iteration = iterations[squareId] || 0
      const xSeed = Math.sin((squareId + 1) * 12.9898 + iteration * 31.4159) * 43758.5453
      const ySeed = Math.sin((squareId + 1) * 78.233 + iteration * 19.19) * 24634.6345

      return {
        id: squareId,
        iteration,
        pos: [
          Math.floor((xSeed - Math.floor(xSeed)) * columns),
          Math.floor((ySeed - Math.floor(ySeed)) * rows),
        ],
      }
    })
  }, [dimensions.height, dimensions.width, height, iterations, numSquares, width])

  const updateSquarePosition = useCallback((squareId) => {
    setIterations((current) => ({
      ...current,
      [squareId]: (current[squareId] || 0) + 1,
    }))
  }, [])

  useEffect(() => {
    const element = containerRef.current
    let resizeObserver = null

    if (element) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDimensions((currentDimensions) => {
            const nextWidth = entry.contentRect.width
            const nextHeight = entry.contentRect.height
            if (
              currentDimensions.width === nextWidth &&
              currentDimensions.height === nextHeight
            ) {
              return currentDimensions
            }
            return { width: nextWidth, height: nextHeight }
          })
        }
      })

      resizeObserver.observe(element)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    };
  }, [])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
      {...props}>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}>
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [squareX, squareY], id, iteration }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
              repeatDelay,
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${id}-${iteration}`}
            width={width - 1}
            height={height - 1}
            x={squareX * width + 1}
            y={squareY * height + 1}
            fill="currentColor"
            strokeWidth="0" />
        ))}
      </svg>
    </svg>
  );
}
