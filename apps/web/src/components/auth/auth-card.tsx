import { Separator } from "@ingot/ui/components/separator";
import { cn } from "@ingot/ui/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  showTabs?: boolean;
  showLegal?: boolean;
};

const AuthCard = ({ children, title, description, showTabs, showLegal }: AuthCardProps) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isSignIn = pathname === "/auth/sign-in";
  const isSignUp = pathname === "/auth/sign-up";

  return (
    <div className="w-full max-w-md">
      {showTabs && (
        <nav className="mb-6 flex gap-6">
          <Link
            to="/auth/$path"
            params={{ path: "sign-in" }}
            className={cn(
              "text-sm font-medium transition-colors",
              isSignIn ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign In
          </Link>
          <Link
            to="/auth/$path"
            params={{ path: "sign-up" }}
            className={cn(
              "text-sm font-medium transition-colors",
              isSignUp ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign Up
          </Link>
        </nav>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6">{children}</div>

        {showLegal && (
          <>
            <Separator className="mt-6" />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              By signing up, you agree to the{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export { AuthCard };
