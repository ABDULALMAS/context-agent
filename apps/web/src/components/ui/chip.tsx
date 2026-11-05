import { cn } from "@/lib/utils";

export type Tone = "neutral" | "blue" | "warn" | "ok" | "bad" | "live" | "ink";

const toneCls: Record<Tone, string> = {
  neutral: "bg-secondary text-muted-foreground",
  blue: "bg-brand-tint text-brand",
  warn: "bg-warn-tint text-warn",
  ok: "bg-ok-tint text-ok",
  bad: "bg-bad-tint text-bad",
  live: "bg-live-tint text-live",
  ink: "bg-ink text-ink-foreground",
};

export const Chip = ({
  tone = "neutral",
  children,
  className,
  dot,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11.5px] font-medium leading-4",
        toneCls[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};
