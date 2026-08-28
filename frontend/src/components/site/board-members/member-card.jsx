const portraitVariants = [
  {
    frame: "inset-x-0 -inset-y-[5%]",
    image: "object-cover",
    depth: "3.5",
  },
  {
    frame: "inset-x-[7%] -bottom-[5%] top-[1%]",
    image: "object-cover",
    depth: "5",
  },
  {
    frame: "inset-x-[4%] -bottom-[5%] top-[6%]",
    image: "object-contain object-bottom",
    depth: "4.25",
  },
];

export function MemberCard({ index, isVisible = true, member, portraitAlt }) {
  const variant = portraitVariants[index % portraitVariants.length];
  const primaryLabel = member.boardRole || member.professionalTitle;

  return (
    <article className="min-w-0" data-board-card-reveal hidden={!isVisible}>
      <div className="group min-w-0">
        <div
          className="relative aspect-[4/5] overflow-hidden border-t border-[#dfe3e8] bg-[#f1f4f6]"
          data-board-media
        >
          <span className="absolute left-3 top-3 z-10 bg-white/90 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-[#7d8795] backdrop-blur-sm sm:left-4 sm:top-4">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div
            className={`absolute ${variant.frame}`}
            data-board-portrait
            data-depth={variant.depth}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={portraitAlt}
              className={`h-full w-full ${variant.image} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]`}
              decoding="async"
              fetchPriority={index < 3 ? "high" : "auto"}
              height="1350"
              loading={index < 3 ? "eager" : "lazy"}
              src={member.image.url}
              width="1080"
            />
          </div>
        </div>

        <div className="pt-5 sm:pt-6">
          <p className="min-h-10 max-w-[30ch] text-[9px] font-semibold uppercase leading-5 tracking-[0.16em] text-secondary sm:text-[10px]">
            {primaryLabel}
          </p>
          <h3 className="min-h-[3.35rem] font-heading text-[clamp(1.5rem,2.2vw,1.85rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[#14213d]">
            {member.fullName}
          </h3>
          <p className="min-h-6 text-xs font-medium leading-5 text-[#697386]">
            {member.boardRole ? member.professionalTitle : <span aria-hidden="true">&nbsp;</span>}
          </p>
          <p className="mt-4 text-[13px] leading-6 text-[#707a8a]">
            {member.summary}
          </p>
        </div>
      </div>
    </article>
  );
}
