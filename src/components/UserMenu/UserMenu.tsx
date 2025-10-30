import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronUp, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Skeleton,
} from "@/components/ui";
import { useSignOutMutation } from "@/features/authentication";
import { api, zGetMeResponse } from "@/lib/api";
import { cn } from "@/lib/styles";

const getUserQuery = () => ({
  queryKey: ["user", "me"],
  queryFn: () =>
    api
      .get<z.infer<typeof zGetMeResponse>>("/api/v1/users/me")
      .then((response) => response.data),
});

export const UserMenu = () => {
  const { t } = useTranslation(["common", "simulations"]);
  const navigate = useNavigate();
  const userQuery = useQuery(getUserQuery());
  const signOutMutation = useSignOutMutation({
    onSuccess: () => {
      navigate({ to: "/signin" });
    },
  });

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  if (userQuery.isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Skeleton className="size-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!userQuery.data) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {userQuery.data.email}
                </span>
                <span className="truncate text-xs">
                  {userQuery.data.is_active
                    ? t(($) => $.user.active)
                    : t(($) => $.user.inactive)}
                </span>
              </div>
              <ChevronUp className="ml-auto size-4" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] min-w-56 rounded-lg"
            side="top"
            align="start"
            sideOffset={4}
          >
            <div className="grid gap-2">
              <div className="grid gap-1 px-2 py-1.5">
                <div className="font-medium">{userQuery.data.email}</div>
                <div className="text-xs text-muted-foreground">
                  {userQuery.data.is_active
                    ? t(($) => $.user.activeAccount)
                    : t(($) => $.user.inactive)}
                </div>
              </div>
              <Separator />

              <div className="px-1 py-1">
                <LanguageSwitcher />
              </div>
              <Separator />
              <Link to="/optimization">
                <Button size="sm" variant="ghost">
                  {t(($) => $.sidebar.optimizeButton, {
                    ns: "simulations",
                  })}
                </Button>
              </Link>
              <button
                onClick={handleSignOut}
                disabled={signOutMutation.isPending}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                  signOutMutation.isPending && "opacity-50",
                )}
              >
                <LogOut className="size-4" />
                <span>{t(($) => $.user.signOut)}</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
