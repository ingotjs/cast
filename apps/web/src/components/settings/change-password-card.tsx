import { Button } from "@packages/ui/components/button";
import { Label } from "@packages/ui/components/label";
import { cn } from "@packages/ui/lib/utils";
import { usePostHog } from "@posthog/react";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient } from "../../lib/auth-client";
import { passwordRequirements, passwordSchema } from "../../lib/schemas";
import { zodFormResolver } from "../../lib/zod-form-resolver";
import { PasswordInput } from "../auth/password-input";
import { SettingsCard } from "./settings-card";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export const ChangePasswordCard = () => {
  const posthog = usePostHog();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodFormResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: FormValues) => {
    const result = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      revokeOtherSessions: true,
    });

    if (result.error) {
      toast.error(result.error.message ?? "Failed to change password");
      return;
    }

    posthog?.capture("password_changed");
    toast.success("Password changed successfully");
    reset();
  };

  return (
    <SettingsCard title="Password" description="Change your account password.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <PasswordInput id="currentPassword" autoComplete="current-password" {...register("currentPassword")} />
          {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <PasswordInput id="newPassword" autoComplete="new-password" {...register("newPassword")} />
          {newPassword.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {passwordRequirements.map((req) => {
                const met = req.test(newPassword);
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
          {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <PasswordInput id="confirmPassword" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" loading={isSubmitting} data-testid="change-password-button-submit">
          Change password
        </Button>
      </form>
    </SettingsCard>
  );
};
