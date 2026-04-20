"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/cn";

import { Button } from "@/components/ui/Button";

type ModalProps = {
  children: ReactNode;
  className?: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function Modal({
  children,
  className,
  description,
  onClose,
  open,
  title,
}: Readonly<ModalProps>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscapeKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscapeKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleEscapeKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,21,14,0.58)] px-3 py-6 backdrop-blur-[3px] md:px-6"
      role="dialog"
      onClick={onClose}
    >
      <div
        className={cn(
          "max-h-[92vh] max-w-6xl rounded-[30px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.995)_0%,rgba(244,244,244,0.985)_100%)] shadow-[0_28px_70px_rgba(26,21,14,0.32)]",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex items-start justify-between gap-4 border-b border-[var(--homepage-panel-divider)] bg-[linear-gradient(135deg,rgba(132,212,0,0.18)_0%,rgba(78,182,255,0.18)_100%)] px-5 py-5 md:px-7">
          <div className="">
            <h2 className="mt-2 text-2xl font-black text-[var(--homepage-panel-text-strong)]">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-sm font-semibold text-[var(--homepage-panel-text)] md:text-base">
                {description}
              </p>
            ) : null}
          </div>

          <Button
            aria-label="Fechar modal"
            className="absolute right-[8px] top-[8px] flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/80"
            onClick={onClose}
            variant="unstyled"
          >
            <X />
          </Button>
        </div>

        <div className="max-h-[calc(92vh-124px)] overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
