import { Button } from "@ingot/ui/components/button";
import { Label } from "@ingot/ui/components/label";
import { cn } from "@ingot/ui/lib/utils";
import { usePostHog } from "@posthog/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "../../lib/auth-client";
import { passwordRequirements, passwordSchema } from "../../lib/schemas";
import { zodFormResolver } from "../../lib/zod-form-resolver";
import { AuthCard } from "./auth-card";
import { PasswordInput } from "./password-input";

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export const ResetPassword = ({ token }: { token?: string }) => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodFormResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    const result = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (result.error) {
      toast.error(result.error.message ?? "Failed to reset password");
      return;
    }

    posthog?.capture("password_reset_completed");
    toast.success("Password reset successfully");
    void navigate({ to: "/auth/$path", params: { path: "sign-in" } });
  };

  if (!token) {
    return (
      <AuthCard title="Invalid Link" description="This password reset link is invalid or has expired">
        <div className="text-center">
          <Link
            to="/auth/$path"
            params={{ path: "forgot-password" }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Request a new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset Password" description="Enter your new password below">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <PasswordInput id="password" autoComplete="new-password" {...register("password")} />
          {password.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {passwordRequirements.map((req) => {
                const met = req.test(password);
                return (
                  <li
                    key={req.label}
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    )}
                  >
                    {met ? <Check className="size-3" /> : <X className="size-3" />}
                    {req.label}
                  </li>
                );
              })}
            </ul>
          )}
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput id="confirmPassword" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Reset password
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
    </AuthCard>
  );
};
