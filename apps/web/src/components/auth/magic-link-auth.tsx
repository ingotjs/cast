import { Button } from "@packages/ui/components/button";
import { Input } from "@packages/ui/components/input";
import { Label } from "@packages/ui/components/label";
import { Separator } from "@packages/ui/components/separator";
import { usePostHog } from "@posthog/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { signIn } from "../../lib/auth-client";
import { clientEnv } from "../../lib/env";
import { zodFormResolver } from "../../lib/zod-form-resolver";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type FormValues = z.infer<typeof schema>;

/** Magic link sign-in form. Only renders if magic link is enabled via env var. */
export const MagicLinkAuth = () => {
  const posthog = usePostHog();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodFormResolver(schema),
  });

  if (!clientEnv.magicLink) {
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    const result = await signIn.magicLink({ email: data.email });

    if (result.error) {
      toast.error(result.error.message ?? "Failed to send magic link");
      return;
    }

    posthog?.capture("magic_link_requested", { email: data.email });
    setSent(true);
    toast.success("Check your email for a sign-in link");
  };

  if (sent) {
    return (
      <div className="text-center">
        <Separator className="mb-4" />
        <p className="text-sm text-muted-foreground">We sent you a magic link. Check your email to sign in.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative my-4">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
          or
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="magic-link-email">Sign in with magic link</Label>
          <Input
            id="magic-link-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          loading={isSubmitting}
          data-testid="magic-link-button-submit"
        >
          Send magic link
        </Button>
      </form>
    </div>
  );
};
