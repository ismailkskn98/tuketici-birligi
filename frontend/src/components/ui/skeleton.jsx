import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
