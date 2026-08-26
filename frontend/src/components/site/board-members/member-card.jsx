export function MemberCard({ index, member, portraitAlt }) {
  return (
    <article className="min-w-0" data-board-card-reveal>
      <div className="group min-w-0" data-board-card-depth>
        <div
          className="relative aspect-[4/5] overflow-hidden bg-[#f2f4f6]"
          data-board-media
        >
          <div className="absolute inset-x-0 -inset-y-[5%]" data-board-portrait>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={portraitAlt}
              className="h-full w-full object-contain object-bottom transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.018]"
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
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-secondary sm:text-[10px]">
            {member.professionalTitle}
          </p>
          <h3 className="mt-2 font-heading text-[clamp(1.55rem,2.4vw,2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-[#14213d]">
            {member.fullName}
          </h3>
          <p className="mt-4 max-w-[36rem] text-[13px] leading-6 text-[#697386] sm:text-sm">
            {member.summary}
          </p>
        </div>
      </div>
    </article>
  );
}
