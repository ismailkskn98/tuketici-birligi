import { cva } from "class-variance-authority";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const customButtonVariants = cva(
  "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-4 py-2 font-sans text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white shadow-soft hover:bg-black/85",
        secondary: "bg-secondary text-white hover:bg-secondary-dark hover:text-white",
        outline: "border border-line bg-white text-ink hover:border-ink/30 hover:text-ink",
        ghost: "text-ink hover:bg-primary-soft",
      },
      size: {
        sm: "min-h-9 px-3 text-xs",
        md: "min-h-11 px-4 text-sm",
        lg: "min-h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export function CustomButton({ className, variant, size, href, ...props }) {
  const classes = cn(customButtonVariants({ variant, size }), className);

  if (href) {
    return <Link className={cn("cursor-pointer", classes)} href={href} {...props} />;
  }

  return <button className={cn("cursor-pointer", classes)} {...props} />;
}

export { customButtonVariants };
