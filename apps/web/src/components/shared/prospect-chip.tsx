import { Chip, type Tone } from "../ui/chip";

export type ProspectStatus =
  | "queued"
  | "researching"
  | "evaluating"
  | "drafting"
  | "drafted"
  | "skipped"
  | "needs_contact"
  | "failed"
  | "retrying"
  | "excluded";

export const prospectMeta: Record<ProspectStatus, { tone: Tone; label: string }> = {
  queued: { tone: "neutral", label: "Queued" },
  researching: { tone: "blue", label: "Researching" },
  evaluating: { tone: "blue", label: "Evaluating" },
  drafting: { tone: "blue", label: "Drafting" },
  drafted: { tone: "warn", label: "Awaiting approval" },
  skipped: { tone: "neutral", label: "Skipped" },
  needs_contact: { tone: "neutral", label: "Needs contact" },
  failed: { tone: "bad", label: "Failed" },
  retrying: { tone: "bad", label: "Retrying" },
  excluded: { tone: "neutral", label: "Excluded" },
};

export const ProspectChip = ({ status }: { status: ProspectStatus }) => (
  <Chip tone={prospectMeta[status].tone}>{prospectMeta[status].label}</Chip>
);
