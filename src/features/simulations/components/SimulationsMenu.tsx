import { use } from "react";

import { useTranslation } from "react-i18next";

import {
  Button,
  Empty,
  EmptyHeader,
  EmptyTitle,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";

import { SimulationsMenuItem } from "./SimulationsMenuItem";

interface Props {
  lastSimulationRef: (node: HTMLLIElement | null) => void;
  hasFilters: boolean;
  onFiltersClear: () => void;
}

export const SimulationsMenu = ({
  lastSimulationRef,
  hasFilters,
  onFiltersClear,
}: Props) => {
  const { t } = useTranslation(["simulations"]);
  const { isFetchingNextPage, isLoading, simulations, onDeleteSuccess } = use(
    SimulationsFiltersContext,
  );

  if (isLoading && simulations.length === 0) {
    return Array.from({ length: 25 }).map((_, index) => (
      <SidebarMenuItem key={`skeleton-${index}`}>
        <SidebarMenuSkeleton showIcon={false} className="w-full" />
      </SidebarMenuItem>
    ));
  }

  if (simulations.length === 0) {
    return (
      <Empty className="md:p-9">
        <EmptyHeader>
          <EmptyTitle className="text-base">
            {t(($) => $.sidebar.notFoundMessage)}
          </EmptyTitle>
        </EmptyHeader>
        {hasFilters && (
          <Button variant="outline" onClick={onFiltersClear}>
            Clear filters
          </Button>
        )}
      </Empty>
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
          onDeleteSuccess={onDeleteSuccess}
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
