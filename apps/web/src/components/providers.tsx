import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { Link, useRouter } from "@tanstack/react-router";

import { authClient } from "../lib/auth-client";

// Reference: https://better-auth-ui.com/integrations/tanstack-start
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const { navigate } = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={(href) => navigate({ href })}
      replace={(href) => navigate({ href, replace: true })}
      Link={({ href, ...props }) => <Link to={href} {...props} />}
    >
      {children}
    </AuthUIProvider>
  );
};
