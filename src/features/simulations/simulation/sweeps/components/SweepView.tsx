import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Button,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui";
import type { SweepResponse } from "@/features/simulations";
import {
  getSimulationsQueryKeys,
  SimulationsFiltersContext,
  SimulationsSidebar,
  useSimulationFilters,
} from "@/features/simulations";
import {
  SweepProgressView,
  SweepResultsView,
} from "@/features/simulations/simulation/sweeps";
import { queryClient } from "@/lib/tanstack";

interface Props {
  sweep: SweepResponse;
  simulationId: string;
  configName?: string | null;
}

export const SweepView = ({ simulationId, sweep, configName }: Props) => {
  const { t } = useTranslation(["simulations"]);
  const {
    search,
    reportStatus,
    showArchived,
    simulations,
    simulationsQuery,
    setSearch,
    setReportStatus,
    setShowArchived,
  } = useSimulationFilters();

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: getSimulationsQueryKeys(),
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
    setSearch,
    setReportStatus,
    setShowArchived,
    clearFilters: () => {
      setSearch("");
      setReportStatus(undefined);
      setShowArchived(undefined);
    },
    loadMore: () => simulationsQuery.fetchNextPage(),
    onDeleteSuccess: handleDeleteSuccess,
  };

  const isComplete =
    sweep.completed + sweep.failed === sweep.total_parameter_values;

  return (
    <SidebarProvider>
      <SimulationsFiltersContext.Provider value={filtersContextValue}>
        <SimulationsSidebar activeSimulationId={simulationId} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
            <Link to="/simulations/$simulationId" params={{ simulationId }}>
              <Button variant="ghost" size="smIcon">
                <ArrowLeft />
              </Button>
            </Link>
            <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
              <div className="flex flex-col min-w-0">
                <h1 className="text-lg font-semibold truncate">{configName}</h1>
                <p className="text-sm text-muted-foreground">
                  {t(($) => $.sweep.subTitle)}: {sweep.parameter_name}
                </p>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <SweepProgressView sweepData={sweep} />
            {isComplete && <SweepResultsView sweepData={sweep} />}
          </main>
        </SidebarInset>
      </SimulationsFiltersContext.Provider>
    </SidebarProvider>
  );
};
