import { Chip, type Tone } from "../ui/chip";

export type RunStatus = "running" | "paused" | "cancelled" | "partial" | "complete" | "failed";

const runTone: Record<RunStatus, Tone> = {
  running: "blue",
  paused: "warn",
  cancelled: "neutral",
  partial: "warn",
  complete: "ok",
  failed: "bad",
};

const runLabel: Record<RunStatus, string> = {
  running: "Running",
  paused: "Paused",
  cancelled: "Cancelled",
  partial: "Partial",
  complete: "Complete",
  failed: "Failed",
};

export const RunStatusChip = ({ status }: { status: RunStatus }) => (
  <Chip tone={runTone[status]} dot>
    {runLabel[status]}
  </Chip>
);
