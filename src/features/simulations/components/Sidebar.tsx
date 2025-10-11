import { use, useRef } from "react";

import { useTranslation } from "react-i18next";

import {
  Input,
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui";
import { SimulationsMenu } from "@/features/simulations/components/SimulationsMenu";
import { SimulationsSearchContext } from "@/features/simulations/contexts";

interface Props {
  search: string;
  onSearchChange: (search: string) => void;
}

export const Sidebar = ({ search, onSearchChange }: Props) => {
  const { t } = useTranslation(["simulations"]);
  const observerTarget = useRef<HTMLLIElement>(null);

  const {
    isFetchingNextPage,
    hasNextPage,
    onLoadMore,
    isLoading,
    simulations,
  } = use(SimulationsSearchContext);

  const lastSimulationRef = (node: HTMLLIElement | null) => {
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
  };

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
              <SimulationsMenu lastSimulationRef={lastSimulationRef} />
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
