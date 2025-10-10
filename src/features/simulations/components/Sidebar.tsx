import { useCallback, useRef } from "react";

import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Input,
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui";
import type { zSimulationConfigurationInfo } from "@/lib/api";

interface Props {
  search: string;
  onSearchChange: (search: string) => void;
  simulations: Array<z.infer<typeof zSimulationConfigurationInfo>>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export const Sidebar = ({
  search,
  onSearchChange,
  simulations,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: Props) => {
  const { t } = useTranslation(["simulations"]);
  const observerTarget = useRef<HTMLLIElement>(null);

  const lastSimulationRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isFetchingNextPage) return;

      if (observerTarget.current) {
        observerTarget.current = null;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            onLoadMore();
          }
        },
        {
          rootMargin: "100px",
        },
      );

      if (node) {
        observer.observe(node);
        observerTarget.current = node;
      }

      return () => {
        if (observerTarget.current) {
          observer.disconnect();
        }
      };
    },
    [isFetchingNextPage, hasNextPage, onLoadMore],
  );

  return (
    <SidebarRoot>
      <SidebarHeader>
        <Input
          placeholder={t(($) => $.sidebar.search.placeholder)}
          onChange={(event) => onSearchChange(event.target.value)}
          value={search}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && !simulations.length ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={`skeleton-${index}`}>
                      <SidebarMenuSkeleton showIcon={true} />
                    </SidebarMenuItem>
                  ))}
                </>
              ) : simulations.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t(($) => $.sidebar.notFoundMessage)}
                </div>
              ) : (
                <>
                  {simulations.map((simulation, index) => {
                    const isLastItem = index === simulations.length - 1;

                    return (
                      <SidebarMenuItem
                        key={simulation.id}
                        ref={isLastItem ? lastSimulationRef : undefined}
                      >
                        <SidebarMenuButton
                          tooltip={simulation.description ?? undefined}
                        >
                          <span className="truncate">{simulation.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                  {isFetchingNextPage && (
                    <>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <SidebarMenuItem key={`loading-${index}`}>
                          <SidebarMenuSkeleton showIcon={true} />
                        </SidebarMenuItem>
                      ))}
                    </>
                  )}
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && simulations.length > 0 && (
          <div className="px-2 py-1 text-xs text-muted-foreground">
            {t(($) => $.sidebar.scroll.totalSimulations, {
              count: simulations.length,
            })}
            {hasNextPage && t(($) => $.sidebar.scroll.nextPageLabel)}
          </div>
        )}
      </SidebarFooter>
    </SidebarRoot>
  );
};
