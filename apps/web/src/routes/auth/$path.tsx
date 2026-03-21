import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";

import { AuthForm } from "../../components/auth/auth-form";
import { ForgotPassword } from "../../components/auth/forgot-password";
import { ResetPassword } from "../../components/auth/reset-password";

const AuthPage = () => {
  const { path } = useParams({ strict: false }) as { path: string };
  const search: Record<string, unknown> = useSearch({ strict: false });
  const token = typeof search.token === "string" ? search.token : undefined;

  const content = (() => {
    switch (path) {
      case "forgot-password": {
        return <ForgotPassword />;
      }
      case "reset-password": {
        return <ResetPassword token={token} />;
      }
      default: {
        return <AuthForm />;
      }
    }
  })();

  return <main className="container mx-auto my-auto flex flex-col items-center p-4 md:p-6">{content}</main>;
};

export const Route = createFileRoute("/auth/$path")({
  component: AuthPage,
});
