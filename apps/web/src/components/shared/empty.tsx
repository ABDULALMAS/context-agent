export const Empty = ({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) => {
  return (
    <div className="card-ring flex flex-col items-center p-[44px] text-center">
      <p className="h4">{title}</p>
      {children && <p className="mt-2 max-w-md text-ui text-muted-foreground">{children}</p>}
      {action && <div className="mt-[22px]">{action}</div>}
    </div>
  );
};
