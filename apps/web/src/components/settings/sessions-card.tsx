import { Button } from "@packages/ui/components/button";
import { usePostHog } from "@posthog/react";
import { Monitor, Smartphone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "../../lib/auth-client";
import { SettingsCard } from "./settings-card";

type SessionItem = {
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
};

const isMobileUserAgent = (ua?: string | null) =>
  Boolean(ua && /mobile|android|iphone|ipad/i.test(ua));

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const SessionsCard = () => {
  const posthog = usePostHog();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    const result = await authClient.listSessions();
    if (result.data) {
      setSessions(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const revokeSession = async (token: string) => {
    setRevokingToken(token);
    const result = await authClient.revokeSession({ token });

    if (result.error) {
      toast.error(result.error.message ?? "Failed to revoke session");
      setRevokingToken(null);
      return;
    }

    posthog?.capture("session_revoked");
    toast.success("Session revoked");
    setSessions((prev) => prev.filter((s) => s.token !== token));
    setRevokingToken(null);
  };

  return (
    <SettingsCard
      title="Sessions"
      description="Manage your active sessions across devices."
    >
      {loading && (
        <p className="text-sm text-muted-foreground">Loading sessions...</p>
      )}

      {!loading && sessions.length === 0 && (
        <p className="text-sm text-muted-foreground">No active sessions.</p>
      )}

      {!loading && sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.token}
              className="flex items-center justify-between gap-4 rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                {isMobileUserAgent(session.userAgent) ? (
                  <Smartphone className="size-5 text-muted-foreground" />
                ) : (
                  <Monitor className="size-5 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {session.userAgent
                      ? session.userAgent.slice(0, 50)
                      : "Unknown device"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.ipAddress ?? "Unknown IP"} &middot;{" "}
                    {formatDate(session.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                loading={revokingToken === session.token}
                onClick={() => revokeSession(session.token)}
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      )}
    </SettingsCard>
  );
};
