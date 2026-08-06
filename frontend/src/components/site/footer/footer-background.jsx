import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

export function FooterBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatedGridPattern
        className="inset-x-0 inset-y-[-28%] h-[156%] skew-x-12 fill-primary-dark/20 stroke-primary-dark/11 text-primary-dark mask-[radial-gradient(ellipse_at_center,white,transparent_72%)]"
        duration={3.6}
        height={44}
        maxOpacity={0.1}
        numSquares={18}
        repeatDelay={1}
        width={44}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-dark/20 to-transparent" />
    </div>
  );
}
