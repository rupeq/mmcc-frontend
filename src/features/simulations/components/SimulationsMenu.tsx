import { use } from "react";

import { useTranslation } from "react-i18next";

import { SidebarMenuItem, SidebarMenuSkeleton } from "@/components/ui";
import { SimulationsSearchContext } from "@/features/simulations/contexts";

import { SimulationsMenuItem } from "./SimulationsMenuItem";

interface Props {
  lastSimulationRef: (node: HTMLLIElement | null) => void;
}

export const SimulationsMenu = ({ lastSimulationRef }: Props) => {
  const { t } = useTranslation(["simulations"]);

  const { isFetchingNextPage, isLoading, simulations } = use(
    SimulationsSearchContext,
  );

  if (isLoading && simulations.length === 0) {
    return Array.from({ length: 25 }).map((_, index) => (
      <SidebarMenuItem key={`skeleton-${index}`}>
        <SidebarMenuSkeleton showIcon={false} />
      </SidebarMenuItem>
    ));
  }

  if (simulations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t(($) => $.sidebar.notFoundMessage)}
      </div>
    );
  }

  return (
    <>
      {simulations.map((simulation, index) => (
        <SimulationsMenuItem
          simulation={simulation}
          key={simulation.id}
          isLastItem={simulations.length - 1 === index}
          lastSimulationRef={lastSimulationRef}
        />
      ))}
      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, index) => (
          <SidebarMenuItem key={`loading-${index}`}>
            <SidebarMenuSkeleton showIcon={false} />
          </SidebarMenuItem>
        ))}
    </>
  );
};
