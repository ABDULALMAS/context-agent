export const CapChip = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-foreground">
      {children}
    </span>
  );
};
