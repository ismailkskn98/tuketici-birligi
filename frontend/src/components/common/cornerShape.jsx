import { cn } from "@/lib/utils";

export default function CornerShape({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={cn("absolute left-0 top-0", className)}>
      <path fill="currentColor" d="M0 24h24C10.745 24 0 13.255 0 0z" />
    </svg>
  );
}
