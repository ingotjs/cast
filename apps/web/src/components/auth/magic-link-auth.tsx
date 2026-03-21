import { Separator } from "@ingot/ui/components/separator";
import { usePostHog } from "@posthog/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { signIn } from "../../lib/auth-client";
import { clientEnv } from "../../lib/env";

/** Magic link sign-in. Uses the email from the parent form. Only renders if magic link is enabled. */
export const MagicLinkAuth = ({ email }: { email: string }) => {
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!clientEnv.magicLink) {
    return null;
  }

  const handleSend = async () => {
    if (!email?.includes("@")) {
      toast.error("Enter a valid email address first");
      return;
    }

    setLoading(true);
    const result = await signIn.magicLink({ email });
    setLoading(false);

    if (result.error) {
      toast.error(result.error.message ?? "Failed to send magic link");
      return;
    }

    posthog?.capture("magic_link_requested", { email });
    setSent(true);
    toast.success("Check your email for a sign-in link");
  };

  if (sent) {
    return (
      <>
        <Separator className="my-4" />
        <p className="text-center text-sm text-muted-foreground">Magic link sent! Check your email to sign in.</p>
      </>
    );
  }

  return (
    <>
      <Separator className="my-4" />
      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        data-testid="magic-link-button-submit"
      >
        {loading && <Loader2 className="size-3 animate-spin" />}
        Email me a sign-in link
      </button>
    </>
  );
};
