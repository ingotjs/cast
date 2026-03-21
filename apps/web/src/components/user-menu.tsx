"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ingot/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ingot/ui/components/dropdown-menu";
import { Trans, useLingui } from "@lingui/react/macro";
import { usePostHog } from "@posthog/react";

import { signOut, useSession } from "@/lib/auth-client";

import { useAuthModal } from "./auth/auth-modal";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
};

export const UserMenu = () => {
  const { data: session } = useSession();
  const posthog = usePostHog();
  const { t } = useLingui();

  const { open: openAuthModal } = useAuthModal();

  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={openAuthModal}
        className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 font-semibold text-[var(--sea-ink)] text-sm shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition"
        data-testid="header-link-signin"
      >
        <Trans>Sign in</Trans>
      </button>
    );
  }

  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-testid="user-menu-button-trigger"
        className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Avatar size="sm">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-foreground text-sm">{user.name}</span>
              <span className="text-muted-foreground text-xs">{user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            data-testid="user-menu-button-account"
            onSelect={() => {
              window.location.href = "/account";
            }}
          >
            {t`Account`}
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="user-menu-button-signout">
            <button
              type="button"
              className="w-full text-left"
              onClick={() => {
                posthog?.capture("user_signed_out");
                posthog?.reset();
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/";
                    },
                  },
                });
              }}
            >
              {t`Sign out`}
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
