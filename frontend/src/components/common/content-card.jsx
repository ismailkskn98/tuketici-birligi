import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <article className={cn("rounded-[8px] border border-line bg-white p-5 shadow-xs transition hover:shadow-soft", className)} {...props} />;
}

export function StaticCard({ className, ...props }) {
  return <div className={cn("rounded-[8px] border border-line bg-white p-5 shadow-xs", className)} {...props} />;
}
