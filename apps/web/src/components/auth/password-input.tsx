import { Input } from "@packages/ui/components/input";
import { cn } from "@packages/ui/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
};

export { PasswordInput };
