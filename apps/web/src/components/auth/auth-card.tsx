import { Separator } from "@ingot/ui/components/separator";
import { Link } from "@tanstack/react-router";

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  showLegal?: boolean;
};

const AuthCard = ({ children, title, description, showLegal }: AuthCardProps) => (
  <div className="w-full max-w-[25rem]">
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>

      {showLegal && (
        <>
          <Separator className="mt-6" />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to the{" "}
            <Link to="/terms" className="underline hover:text-foreground" data-testid="auth-link-legal-terms">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-foreground" data-testid="auth-link-legal-privacy">
              Privacy Policy
            </Link>
            .
          </p>
        </>
      )}
    </div>
  </div>
);

export { AuthCard };
