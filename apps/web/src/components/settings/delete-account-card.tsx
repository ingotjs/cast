import { Button } from "@ingot/ui/components/button";
import { Input } from "@ingot/ui/components/input";
import { Label } from "@ingot/ui/components/label";
import { usePostHog } from "@posthog/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "../../lib/auth-client";
import { SettingsCard } from "./settings-card";

export const DeleteAccountCard = () => {
  const posthog = usePostHog();
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ password: string }>();

  const onSubmit = async (data: { password: string }) => {
    const result = await authClient.deleteUser({
      password: data.password,
    });

    if (result.error) {
      toast.error(result.error.message ?? "Failed to delete account");
      return;
    }

    posthog?.capture("account_deleted");
    posthog?.reset();
    toast.success("Account deleted");
    window.location.href = "/";
  };

  return (
    <SettingsCard
      title="Delete Account"
      description="Permanently delete your account and all associated data. This action cannot be undone."
      destructive
    >
      {showConfirm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Enter your password to confirm</Label>
            <Input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              {...register("password", { required: true })}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="destructive"
              loading={isSubmitting}
              data-testid="delete-account-button-confirm"
            >
              Delete my account
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="destructive" onClick={() => setShowConfirm(true)} data-testid="delete-account-button-trigger">
          Delete account
        </Button>
      )}
    </SettingsCard>
  );
};
