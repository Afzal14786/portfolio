import type { ReactNode } from "react";

type CalloutVariant = "note" | "info" | "warning" | "success";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const defaultTitles: Record<CalloutVariant, string> = {
  note: "NOTE",
  info: "INFORMATION",
  warning: "WARNING",
  success: "GOOD TO KNOW",
};

export function Callout({ variant = "note", title, children }: CalloutProps) {
  return (
    <aside className="writing-callout" data-variant={variant}>
      <p className="writing-callout-title">{title ?? defaultTitles[variant]}</p>

      <div className="writing-callout-content">{children}</div>
    </aside>
  );
}
