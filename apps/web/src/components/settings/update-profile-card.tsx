import { Button } from "@ingot/ui/components/button";
import { Input } from "@ingot/ui/components/input";
import { Label } from "@ingot/ui/components/label";
import { usePostHog } from "@posthog/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { authClient, useSession } from "../../lib/auth-client";
import { zodFormResolver } from "../../lib/zod-form-resolver";
import { SettingsCard } from "./settings-card";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

export const UpdateProfileCard = () => {
  const { data: session } = useSession();
  const posthog = usePostHog();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodFormResolver(schema),
    values: { name: session?.user.name ?? "" },
  });

  const onSubmit = async (data: FormValues) => {
    const result = await authClient.updateUser({ name: data.name });

    if (result.error) {
      toast.error(result.error.message ?? "Failed to update profile");
      return;
    }

    posthog?.capture("profile_updated");
    toast.success("Profile updated");
  };

  return (
    <SettingsCard title="Profile" description="Update your display name.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <Button type="submit" loading={isSubmitting} data-testid="update-profile-button-submit">
          Save
        </Button>
      </form>
    </SettingsCard>
  );
};
