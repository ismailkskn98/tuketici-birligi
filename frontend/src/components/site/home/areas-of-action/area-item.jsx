export function AreaItem({ description, index, title }) {
  return (
    <article className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 py-4 first:pt-0 last:pb-0">
      <span className="font-heading text-3xl font-semibold tracking-tight text-primary-dark/35">{String(index).padStart(2, "0")}</span>

      <div>
        <h3 className="font-heading text-lg font-semibold tracking-tight text-ink">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-7 text-muted">{description}</p> : null}
      </div>
    </article>
  );
}
