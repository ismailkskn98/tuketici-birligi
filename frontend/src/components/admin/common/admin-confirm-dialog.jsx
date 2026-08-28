"use client";

import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AdminConfirmDialog({
  confirmLabel = "Sil",
  description,
  onConfirm,
  onOpenChange,
  open,
  pending = false,
  title,
}) {
  return (
    <Dialog onOpenChange={(nextOpen) => !pending && onOpenChange(nextOpen)} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="leading-6">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button disabled={pending} onClick={() => onOpenChange(false)} variant="outline">
            Vazgeç
          </Button>
          <Button disabled={pending} onClick={onConfirm} variant="destructive">
            {pending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
            {pending ? "İşleniyor" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
