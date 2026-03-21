import { Button } from "@ingot/ui/components/button";
import { Input } from "@ingot/ui/components/input";
import { Label } from "@ingot/ui/components/label";
import { usePostHog } from "@posthog/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { signIn, signUp } from "../../lib/auth-client";
import { zodFormResolver } from "../../lib/zod-form-resolver";
import { AuthCard } from "./auth-card";
import { MagicLinkAuth } from "./magic-link-auth";
import { PasswordInput } from "./password-input";
import { SocialAuth } from "./social-auth";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export const AuthForm = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodFormResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    // Try sign in first
    const signInResult = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (!signInResult.error) {
      const user = signInResult.data?.user;
      if (user) {
        posthog?.identify(user.id, { email: user.email, name: user.name });
        posthog?.capture("user_signed_in", { email: user.email });
      }
      if (onSuccess) onSuccess();
      else navigate({ to: "/" });
      return;
    }

    // Sign in failed — try creating an account
    const signUpResult = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.email.split("@")[0],
    });

    if (!signUpResult.error) {
      const user = signUpResult.data?.user;
      if (user) {
        posthog?.identify(user.id, { email: user.email, name: user.name });
        posthog?.capture("user_signed_up", { email: user.email, name: user.name });
      }
      if (onSuccess) onSuccess();
      else navigate({ to: "/" });
      return;
    }

    // Both failed — likely wrong password for an existing account
    toast.error("Invalid email or password");
  };

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <AuthCard title="Welcome" description="Sign in to your account or create a new one" showLegal>
      <SocialAuth />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-hydrated={hydrated || undefined}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            data-testid="signin-input-email"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth/$path"
              params={{ path: "forgot-password" }}
              className="text-xs text-muted-foreground hover:text-foreground"
              data-testid="signin-link-forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            data-testid="signin-input-password"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting} data-testid="signin-button-submit">
          Continue
        </Button>
      </form>
      <MagicLinkAuth email={watch("email")} />
    </AuthCard>
  );
};
