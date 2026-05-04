"use client";

import {
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const maxTextareaHeight = 144;

export function MessageComposer({
  disabled,
  draft,
  layout = "page",
  onDraftChange,
  onSubmit,
}: Readonly<{
  disabled?: boolean;
  draft: string;
  layout?: "floating" | "page";
  onDraftChange: (draft: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxTextareaHeight)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxTextareaHeight ? "auto" : "hidden";
  }, [draft]);

  function handleDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onDraftChange(event.target.value);
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();

    if (disabled || draft.trim().length === 0) {
      return;
    }

    event.currentTarget.form?.requestSubmit();
  }

  return (
    <form
      className={cn(
        "flex items-end gap-2 border-t border-[var(--homepage-panel-divider)] bg-white/88",
        layout === "floating" ? "p-2" : "p-3",
        disabled ? "opacity-75" : "",
      )}
      onSubmit={onSubmit}
    >
      <textarea
        className={cn(
          "flex-1 resize-none rounded-[18px] border border-[var(--homepage-panel-divider)] bg-[var(--homepage-panel-surface-subtle)] font-semibold text-[var(--homepage-panel-text)] outline-none transition placeholder:text-[var(--homepage-panel-text-muted)] focus:border-[var(--homepage-highlight-border)] focus:bg-white",
          layout === "floating"
            ? "min-h-10 px-3 py-2 text-xs leading-5"
            : "min-h-11 px-4 py-3 text-sm leading-6",
        )}
        disabled={disabled}
        onChange={handleDraftChange}
        onKeyDown={handleDraftKeyDown}
        placeholder={disabled ? "Canal somente leitura" : "Escreva uma mensagem..."}
        ref={textareaRef}
        rows={1}
        value={draft}
      />
      <Button
        aria-label="Enviar mensagem"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          layout === "floating" ? "h-10 w-10" : "h-11 w-11",
        )}
        disabled={disabled || draft.trim().length === 0}
        type="submit"
        variant="primary"
      >
        <SendHorizontal className="h-5 w-5" strokeWidth={2.6} />
      </Button>
    </form>
  );
}
