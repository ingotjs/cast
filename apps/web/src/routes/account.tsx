import { consts } from "@packages/utils/consts";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { ChangePasswordCard } from "../components/settings/change-password-card";
import { DeleteAccountCard } from "../components/settings/delete-account-card";
import { PasskeysCard } from "../components/settings/passkeys-card";
import { SessionsCard } from "../components/settings/sessions-card";
import { UpdateProfileCard } from "../components/settings/update-profile-card";
import { getSession } from "../lib/auth-client";

const AccountPage = () => (
  <main className="container mx-auto max-w-2xl px-4 py-12 md:py-20">
    <h1 className="text-3xl font-bold tracking-tight">Account</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      Manage your account settings and preferences.
    </p>

    <div className="mt-8 space-y-6">
      <UpdateProfileCard />
      {consts.auth.password && <ChangePasswordCard />}
      <SessionsCard />
      {consts.auth.passkey && <PasskeysCard />}
      <DeleteAccountCard />
    </div>
  </main>
);

export const Route = createFileRoute("/account")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session?.user) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
      });
    }
  },
  component: AccountPage,
});
