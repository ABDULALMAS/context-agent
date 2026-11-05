import { Chip, type Tone } from "../ui/chip";

export type DeliveryMode = "dry_run" | "preview" | "live";

export const deliveryMeta: Record<DeliveryMode, { tone: Tone; label: string; record: string }> = {
  dry_run: { tone: "neutral", label: "Dry Run", record: "Dry run, nothing sent" },
  preview: { tone: "blue", label: "Preview to Me", record: "Preview, not sent to prospect" },
  live: { tone: "live", label: "Live", record: "Sent to prospect" },
};

export const DeliveryChip = ({ mode }: { mode: DeliveryMode }) => (
  <Chip tone={deliveryMeta[mode].tone} dot>
    {deliveryMeta[mode].label}
  </Chip>
);
