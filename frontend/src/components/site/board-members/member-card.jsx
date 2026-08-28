export function MemberCard({ index, isCompact = false, isVisible = true, member, portraitAlt }) {
  const primaryLabel = member.boardRole || member.professionalTitle;

  return (
    <article className="min-w-0" data-board-card-reveal hidden={!isVisible}>
      <div className="group min-w-0">
        <div className="relative aspect-[4/5] overflow-hidden border-t border-[#dfe3e8] bg-[#f1f4f6]" data-board-media>
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={portraitAlt}
              className="block h-full w-full scale-[1.01] object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
              decoding="async"
              fetchPriority={index < 3 ? "high" : "auto"}
              height="1350"
              loading={index < 3 ? "eager" : "lazy"}
              src={member.image.url}
              width="1080"
            />
          </div>
        </div>

        <div className={isCompact ? "pt-3 sm:pt-6" : "pt-5 sm:pt-6"}>
          <p className={`max-w-[30ch] font-semibold uppercase tracking-[0.16em] text-secondary sm:min-h-5 sm:text-[10px] sm:leading-5 ${
            isCompact ? "min-h-7 text-[8px] leading-[0.875rem]" : "min-h-5 text-[9px] leading-5"
          }`}>{primaryLabel}</p>
          <h3 className={`font-heading font-medium tracking-[-0.04em] text-[#14213d] sm:mt-1.5 sm:min-h-10 sm:text-[clamp(1.5rem,2.2vw,1.85rem)] sm:leading-[1.02] ${
            isCompact
              ? "mt-1 min-h-10 text-[1.08rem] leading-[1.08]"
              : "mt-1.5 min-h-9 text-[clamp(1.5rem,2.2vw,1.85rem)] leading-[1.02]"
          }`}>{member.fullName}</h3>
          <p className={`text-[#707a8a] sm:mt-2.5 sm:text-[13px] sm:leading-6 ${
            isCompact
              ? "mt-2 text-[10px] leading-[1.55]"
              : "mt-2.5 text-[13px] leading-6"
          }`}>{member.summary}</p>
        </div>
      </div>
    </article>
  );
}
