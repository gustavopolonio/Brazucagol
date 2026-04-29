"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

type SelectOption = {
  description?: string;
  label: string;
  leadingContent?: ReactNode;
  value: string;
  disabled?: boolean;
};

type SelectProps = {
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value: string;
};

type DropdownPosition = {
  left: number;
  top: number;
  width: number;
};

export function Select({
  "aria-label": ariaLabel,
  className,
  disabled,
  name,
  onValueChange,
  options,
  placeholder = "Selecione uma opção",
  value,
}: Readonly<SelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function updateDropdownPosition() {
      const triggerRectangle = triggerRef.current?.getBoundingClientRect();

      if (!triggerRectangle) {
        return;
      }

      setDropdownPosition({
        left: triggerRectangle.left,
        top: triggerRectangle.bottom + 8,
        width: triggerRectangle.width,
      });
    }

    function handlePointerDown(event: PointerEvent) {
      const eventTarget = event.target as Node;

      if (
        !selectRef.current?.contains(eventTarget) &&
        !dropdownRef.current?.contains(eventTarget)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    updateDropdownPosition();
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  function handleOptionSelect(option: SelectOption) {
    if (option.disabled) {
      return;
    }

    onValueChange(option.value);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={selectRef}>
      {name ? <input name={name} type="hidden" value={value} /> : null}
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          "flex h-[50px] w-full items-center gap-3 rounded-[16px] border border-[var(--homepage-account-item-border)] bg-[linear-gradient(180deg,var(--card)_0%,var(--homepage-account-item-end)_100%)] px-3 py-2 text-left text-sm font-black text-[var(--homepage-panel-text-strong)] shadow-[0_1px_0_var(--homepage-account-item-inset)_inset] outline-none transition hover:border-[var(--homepage-account-item-hover-border)] hover:bg-[linear-gradient(180deg,var(--homepage-account-item-hover-start)_0%,var(--homepage-account-item-hover-end)_100%)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[rgba(78,182,255,0.22)] disabled:cursor-default disabled:opacity-60",
          isOpen
            ? "border-[var(--ring)] ring-2 ring-[rgba(78,182,255,0.22)]"
            : "",
          className,
        )}
        disabled={disabled}
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        ref={triggerRef}
        type="button"
      >
        {selectedOption?.leadingContent ? (
          <span className="shrink-0">{selectedOption.leadingContent}</span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block truncate">{selectedOption?.label ?? placeholder}</span>
          {selectedOption?.description ? (
            <span className="block truncate text-xs font-bold text-[var(--homepage-panel-text-muted)]">
              {selectedOption.description}
            </span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-5 w-5 shrink-0 text-[var(--homepage-panel-chevron)] transition",
            isOpen ? "rotate-180" : "",
          )}
          strokeWidth={3}
        />
      </button>

      {isOpen && dropdownPosition
        ? createPortal(
          <div
            className="fixed z-[1000] max-h-80 overflow-hidden rounded-[18px] border border-[var(--homepage-panel-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,245,245,0.98)_100%)] p-2 shadow-[0_18px_34px_rgba(73,54,20,0.18)]"
            ref={dropdownRef}
            role="listbox"
            style={{
              left: dropdownPosition.left,
              top: dropdownPosition.top,
              width: dropdownPosition.width,
            }}
          >
            <div className="max-h-72 overflow-y-auto pr-1">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    aria-selected={isSelected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition",
                      isSelected
                        ? "bg-[linear-gradient(180deg,var(--rounds-highlight-start)_0%,var(--rounds-highlight-end)_100%)] text-[var(--rounds-highlight-text)] shadow-[0_1px_0_rgba(255,255,255,0.22)_inset]"
                        : "text-[var(--homepage-panel-text)] hover:bg-[var(--homepage-panel-hover)] hover:text-[var(--homepage-panel-hover-foreground)]",
                      option.disabled ? "cursor-default opacity-50" : "cursor-pointer",
                    )}
                    disabled={option.disabled}
                    key={option.value}
                    onClick={() => handleOptionSelect(option)}
                    role="option"
                    type="button"
                  >
                    {option.leadingContent ? (
                      <span className="shrink-0">{option.leadingContent}</span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black">{option.label}</span>
                      {option.description ? (
                        <span
                          className={cn(
                            "block truncate text-xs font-bold",
                            isSelected
                              ? "text-[var(--rounds-highlight-text)]/80"
                              : "text-[var(--homepage-panel-text-muted)]",
                          )}
                        >
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? <Check className="h-5 w-5 shrink-0" strokeWidth={3} /> : null}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )
        : null}
    </div>
  );
}
