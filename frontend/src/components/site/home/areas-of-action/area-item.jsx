export function AreaItem({ description, index, title }) {
  return (
    <article className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-b border-line/55 py-5 first:pt-0 last:border-b-0 last:pb-0">
      <span className="font-heading text-[2.15rem] font-light leading-none tracking-tight text-ink/15">
        {String(index).padStart(2, "0")}
      </span>

      <div className="min-w-0 pt-1">
        <h3 className="font-heading text-base font-semibold leading-snug tracking-tight text-ink">{title}</h3>
        {description ? <p className="mt-1.5 text-[13px] font-light leading-6 text-muted">{description}</p> : null}
      </div>
    </article>
  );
}
