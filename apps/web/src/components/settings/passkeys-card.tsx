import { Button } from "@ingot/ui/components/button";
import { usePostHog } from "@posthog/react";
import { Fingerprint, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient, passkey as passkeyClient } from "../../lib/auth-client";
import { SettingsCard } from "./settings-card";

type PasskeyItem = {
  id: string;
  name?: string | null;
  createdAt?: Date | null;
};

const formatDate = (date?: Date | null) => {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const PasskeysCard = () => {
  const posthog = usePostHog();
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPasskeys = useCallback(async () => {
    const result = await authClient.passkey.listUserPasskeys();
    if (result.data) {
      setPasskeys(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchPasskeys();
  }, [fetchPasskeys]);

  const addPasskey = async () => {
    setAdding(true);
    const result = await passkeyClient.addPasskey();

    if (result?.error) {
      const msg = result.error.message;
      toast.error(typeof msg === "string" ? msg : "Failed to add passkey");
      setAdding(false);
      return;
    }

    posthog?.capture("passkey_added");
    toast.success("Passkey added");
    setAdding(false);
    void fetchPasskeys();
  };

  const deletePasskey = async (id: string) => {
    setDeletingId(id);
    const result = await authClient.passkey.deletePasskey({ id });

    if (result.error) {
      const msg = result.error.message;
      toast.error(typeof msg === "string" ? msg : "Failed to delete passkey");
      setDeletingId(null);
      return;
    }

    posthog?.capture("passkey_deleted");
    toast.success("Passkey deleted");
    setPasskeys((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  return (
    <SettingsCard title="Passkeys" description="Manage passwordless sign-in with passkeys.">
      <div className="space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading passkeys...</p>}

        {!loading && passkeys.length === 0 && (
          <p className="text-sm text-muted-foreground">No passkeys registered yet.</p>
        )}

        {!loading &&
          passkeys.map((pk) => (
            <div key={pk.id} className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Fingerprint className="size-5 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{pk.name ?? "Unnamed passkey"}</p>
                  {pk.createdAt && <p className="text-xs text-muted-foreground">Added {formatDate(pk.createdAt)}</p>}
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon-sm"
                loading={deletingId === pk.id}
                onClick={async () => deletePasskey(pk.id)}
                aria-label="Delete passkey"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}

        <Button variant="outline" loading={adding} onClick={addPasskey}>
          <Fingerprint className="size-4" />
          Add passkey
        </Button>
      </div>
    </SettingsCard>
  );
};
