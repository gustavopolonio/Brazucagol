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
  onDraftChange,
  onSubmit,
}: Readonly<{
  disabled?: boolean;
  draft: string;
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
        "flex items-end gap-2 border-t border-[var(--homepage-panel-divider)] bg-white/88 p-3",
        disabled ? "opacity-75" : "",
      )}
      onSubmit={onSubmit}
    >
      <textarea
        className="min-h-11 flex-1 resize-none rounded-[18px] border border-[var(--homepage-panel-divider)] bg-[var(--homepage-panel-surface-subtle)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--homepage-panel-text)] outline-none transition placeholder:text-[var(--homepage-panel-text-muted)] focus:border-[var(--homepage-highlight-border)] focus:bg-white"
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
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        disabled={disabled || draft.trim().length === 0}
        type="submit"
        variant="primary"
      >
        <SendHorizontal className="h-5 w-5" strokeWidth={2.6} />
      </Button>
    </form>
  );
}
