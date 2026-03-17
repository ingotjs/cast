"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@packages/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@packages/ui/components/dropdown-menu";
import { Link } from "@tanstack/react-router";

import { signOut, useSession } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
};

export const UserMenu = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Link
        to="/auth/$path"
        params={{ path: "sign-in" }}
        className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 font-semibold text-[var(--sea-ink)] text-sm shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
        data-testid="header-signin-link"
      >
        {m.user_menu_signin()}
      </Link>
    );
  }

  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-testid="user-menu-trigger"
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
              <span className="font-medium text-foreground text-sm">
                {user.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            data-testid="user-menu-account"
            onSelect={() => {
              window.location.href = "/account";
            }}
          >
            {m.user_menu_account()}
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="user-menu-signout">
            <button
              type="button"
              className="w-full text-left"
              onClick={() => {
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/";
                    },
                  },
                });
              }}
            >
              {m.user_menu_signout()}
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
