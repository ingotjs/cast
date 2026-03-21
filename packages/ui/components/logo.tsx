import { cn } from "@ingot/ui/lib/utils";

import { OmegaIcon } from "../svgs/omega-icon.js";

export const LogoIcon = ({ size = 20, className }: { size?: number; className?: string }) => (
  <OmegaIcon size={size} className={className} />
);

export const Logo = ({ name, className }: { name: string; className?: string }) => (
  <span className={cn("inline-flex items-center gap-2", className)}>
    <LogoIcon className="text-[var(--lagoon-deep)]" />
    <span className="font-semibold tracking-tight">{name}</span>
  </span>
);
