// Place your logo file at public/logo.svg (the same SVG you uploaded).
export const Logo = ({ compact = false }: { compact?: boolean }) => {
  return (
    <span className="inline-flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.svg"
        alt=""
        width={28}
        height={28}
        className="size-7 shrink-0 rounded-[8px]"
      />
      {!compact && (
        <>
          <span className="text-[17px] tracking-[-0.4px]">Context.dev</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground">
            Bot
          </span>
        </>
      )}
    </span>
  );
};
