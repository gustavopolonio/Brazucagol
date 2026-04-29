"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type ConfirmationModalProps = {
  cancelLabel?: string;
  children?: ReactNode;
  confirmLabel?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function ConfirmationModal({
  cancelLabel = "Cancelar",
  children,
  confirmLabel = "Confirmar",
  message,
  onCancel,
  onConfirm,
  open,
}: Readonly<ConfirmationModalProps>) {
  return (
    <Modal className="w-full max-w-md overflow-hidden" onClose={onCancel} open={open} title="Confirmar ação">
      <div className="space-y-5">
        <p className="text-base font-bold leading-relaxed text-[var(--homepage-panel-text)]">
          {message}
        </p>

        {children}

        <div className="flex justify-end gap-3">
          <Button className="rounded-full px-5 py-3 text-sm font-black" onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button className="rounded-full px-5 py-3 text-sm font-black" onClick={onConfirm} variant="primary">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
