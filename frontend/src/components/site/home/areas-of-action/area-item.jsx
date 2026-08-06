export function AreaItem({ description, index, title }) {
  return (
    <article className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-b border-line/55 py-4 first:pt-0 last:border-b-0 last:pb-0 lg:gap-3 lg:py-3.5 xl:gap-4 xl:py-5">
      <span className="font-heading text-[1.75rem] font-light leading-none tracking-tight text-ink/15 lg:text-[1.65rem] xl:text-[1.9rem] 2xl:text-[2.15rem]">
        {String(index).padStart(2, "0")}
      </span>

      <div className="min-w-0 pt-0.5 lg:pt-0.5 xl:pt-1">
        <h3 className="font-heading text-[15px] font-semibold leading-snug tracking-tight text-ink lg:text-sm xl:text-[15px] 2xl:text-base">{title}</h3>
        {description ? <p className="mt-1 text-[12px] font-light leading-5 text-muted lg:mt-1 lg:leading-5 xl:mt-1.5 xl:text-[13px] xl:leading-6">{description}</p> : null}
      </div>
    </article>
  );
}
