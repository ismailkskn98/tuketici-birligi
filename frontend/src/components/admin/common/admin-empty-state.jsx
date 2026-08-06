import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminEmptyState({ title, description, action, icon: Icon = Inbox, className }) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface/70 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="grid size-11 place-items-center rounded-md border border-line bg-white text-muted shadow-xs">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      {description ? <p className="mt-2 max-w-lg text-sm leading-6 text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
