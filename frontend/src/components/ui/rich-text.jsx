export function RichText({ body }) {
  if (!body) return null;

  return (
    <div className="space-y-4 text-base leading-8 text-ink">
      {body.split("\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

