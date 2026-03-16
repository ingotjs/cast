import { createFileRoute, useParams, useSearch } from "@tanstack/react-router";

import { ForgotPassword } from "../../components/auth/forgot-password";
import { ResetPassword } from "../../components/auth/reset-password";
import { SignIn } from "../../components/auth/sign-in";
import { SignUp } from "../../components/auth/sign-up";

const AuthPage = () => {
  const { path } = useParams({ strict: false }) as { path: string };
  const search: Record<string, unknown> = useSearch({ strict: false });
  const token = typeof search.token === "string" ? search.token : undefined;

  const content = (() => {
    switch (path) {
      case "sign-up": {
        return <SignUp />;
      }
      case "forgot-password": {
        return <ForgotPassword />;
      }
      case "reset-password": {
        return <ResetPassword token={token} />;
      }
      default: {
        return <SignIn />;
      }
    }
  })();

  return (
    <main className="container mx-auto my-auto flex flex-col items-center p-4 md:p-6">
      {content}
    </main>
  );
};

export const Route = createFileRoute("/auth/$path")({
  component: AuthPage,
});
