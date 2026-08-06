import { cn } from "@/lib/utils";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function SectionHeading({ eyebrow, title, description, className, eyebrowTone = "secondary" }) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <div className="mb-3 sm:mb-3.5 md:mb-4">
          <SectionEyebrow tone={eyebrowTone}>{eyebrow}</SectionEyebrow>
        </div>
      ) : null}
      <h2 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-muted sm:mt-3.5 md:mt-4 md:text-lg">{description}</p> : null}
    </div>
  );
}
