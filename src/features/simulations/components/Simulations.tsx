import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";
import { useSimulationFilters } from "@/features/simulations/hooks";
import { simulationsSearchSchema } from "@/features/simulations/schemas";

import { SimulationsSidebar } from "./SimulationsSidebar";

interface Props {
  defaultSearch?: z.infer<typeof simulationsSearchSchema>;
}

export const Simulations = ({ defaultSearch }: Props) => {
  const navigate = useNavigate({ from: "/" });

  const {
    search,
    reportStatus,
    showArchived,
    simulations,
    simulationsQuery,
    setSearch,
    setReportStatus,
    setShowArchived,
  } = useSimulationFilters(defaultSearch);

  const updateUrlWithFilters = (
    newSearch?: string,
    newReportStatus?: z.infer<typeof simulationsSearchSchema>["reportStatus"],
    newIsActive?: boolean,
  ) => {
    navigate({
      search: () => ({
        search: newSearch || undefined,
        reportStatus: newReportStatus,
        showArchived: newIsActive || undefined,
      }),
    });
  };

  const filtersContextValue = {
    search,
    reportStatus,
    showArchived,
    simulations,
    isLoading: simulationsQuery.isLoading,
    isFetchingNextPage: simulationsQuery.isFetchingNextPage,
    hasNextPage: simulationsQuery.hasNextPage,
    setSearch: (newSearch: string) => {
      setSearch(newSearch);
      updateUrlWithFilters(newSearch, reportStatus, showArchived);
    },
    setReportStatus: (
      newStatus: z.infer<typeof simulationsSearchSchema>["reportStatus"],
    ) => {
      setReportStatus(newStatus);
      updateUrlWithFilters(search, newStatus, showArchived);
    },
    setShowArchived: (newIsActive?: boolean) => {
      if (newIsActive) {
        setShowArchived(newIsActive);
      } else {
        setShowArchived(undefined);
      }
      updateUrlWithFilters(search, reportStatus, newIsActive);
    },
    clearFilters: () => {
      setSearch("");
      setReportStatus(undefined);
      setShowArchived(undefined);
      updateUrlWithFilters();
    },
    loadMore: () => simulationsQuery.fetchNextPage(),
  };

  return (
    <SidebarProvider>
      <SimulationsFiltersContext.Provider value={filtersContextValue}>
        <SimulationsSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Simulations</h1>
          </header>
          <main className="p-4">
            <p className="text-muted-foreground">
              Select a simulation from the sidebar to view details
            </p>
          </main>
        </SidebarInset>
      </SimulationsFiltersContext.Provider>
    </SidebarProvider>
  );
};
