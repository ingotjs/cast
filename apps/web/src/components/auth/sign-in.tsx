import { Button } from "@packages/ui/components/button";
import { Input } from "@packages/ui/components/input";
import { Label } from "@packages/ui/components/label";
import { usePostHog } from "@posthog/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { signIn } from "../../lib/auth-client";
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

export const SignIn = () => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodFormResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      toast.error(result.error.message ?? "Invalid email or password");
      return;
    }

    const user = result.data?.user;
    if (user) {
      posthog?.identify(user.id, { email: user.email, name: user.name });
      posthog?.capture("user_signed_in", { email: user.email });
    }

    navigate({ to: "/" });
  };

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <AuthCard title="Sign In" description="Enter your credentials to sign in" showTabs showLegal>
      <SocialAuth />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-hydrated={hydrated || undefined}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth/$path"
              params={{ path: "forgot-password" }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting} data-testid="signin-button-submit">
          Sign in
        </Button>
      </form>
      <MagicLinkAuth />
    </AuthCard>
  );
};
