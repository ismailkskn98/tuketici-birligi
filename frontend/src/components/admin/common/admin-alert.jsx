import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AdminAlert({ title, children, variant = "default", icon: Icon }) {
  return (
    <Alert variant={variant}>
      {Icon ? <Icon aria-hidden="true" className="size-4" /> : null}
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {children ? <AlertDescription>{children}</AlertDescription> : null}
    </Alert>
  );
}
