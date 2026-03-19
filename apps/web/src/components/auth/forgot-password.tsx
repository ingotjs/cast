import { Button } from "@ingot/ui/components/button";
import { Input } from "@ingot/ui/components/input";
import { Label } from "@ingot/ui/components/label";
import { usePostHog } from "@posthog/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "../../lib/auth-client";
import { zodFormResolver } from "../../lib/zod-form-resolver";
import { AuthCard } from "./auth-card";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type FormValues = z.infer<typeof schema>;

export const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const posthog = usePostHog();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodFormResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const result = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/auth/reset-password",
    });

    if (result.error) {
      toast.error(result.error.message ?? "Something went wrong");
      return;
    }

    posthog?.capture("password_reset_requested");
    setSent(true);
    toast.success("Check your email for a reset link");
  };

  return (
    <AuthCard
      title="Forgot Password"
      description={sent ? "Check your email for a password reset link" : "Enter your email to receive a reset link"}
    >
      {sent ? (
        <div className="text-center">
          <Link
            to="/auth/$path"
            params={{ path: "sign-in" }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Send reset link
          </Button>

          <div className="text-center">
            <Link
              to="/auth/$path"
              params={{ path: "sign-in" }}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
};
