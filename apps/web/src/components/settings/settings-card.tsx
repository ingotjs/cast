import { cn } from "@packages/ui/lib/utils";

type SettingsCardProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  destructive?: boolean;
};

export const SettingsCard = ({
  children,
  title,
  description,
  className,
  destructive,
}: SettingsCardProps) => (
  <div
    className={cn(
      "rounded-xl border bg-card p-6 shadow-sm",
      destructive ? "border-destructive/30" : "border-border",
      className
    )}
  >
    <h2
      className={cn("text-lg font-semibold", destructive && "text-destructive")}
    >
      {title}
    </h2>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    <div className="mt-5">{children}</div>
  </div>
);
