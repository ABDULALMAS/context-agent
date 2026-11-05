export const PageHeader = ({
  title,
  sub,
  actions,
}: {
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}) => {
  return (
    <div className="mb-[44px] flex flex-col gap-[14px] sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="h2">{title}</h1>
        {sub && <p className="mt-1.5 text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
};
