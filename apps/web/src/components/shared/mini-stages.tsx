import { cn } from "@/lib/utils";

export type Stage = "discover" | "enrich" | "evaluate" | "draft" | "review" | "deliver";

export const STAGES: { id: Stage; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "enrich", label: "Enrich" },
  { id: "evaluate", label: "Evaluate" },
  { id: "draft", label: "Draft" },
  { id: "review", label: "Review" },
  { id: "deliver", label: "Deliver" },
];

export const MiniStages = ({ stage, done }: { stage: Stage; done: boolean }) => {
  const idx = STAGES.findIndex((s) => s.id === stage);
  return (
    <span className="flex gap-0.5" aria-hidden>
      {STAGES.slice(0, 5).map((s, i) => (
        <span
          key={s.id}
          className={cn(
            "h-1 w-3 rounded-full",
            done || i < idx ? "bg-foreground/70" : i === idx ? "bg-brand-soft" : "bg-secondary",
          )}
        />
      ))}
    </span>
  );
};
