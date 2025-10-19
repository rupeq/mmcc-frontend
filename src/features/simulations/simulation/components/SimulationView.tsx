import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui";
import { getSimulationsQueryKeys } from "@/features/simulations";
import { SimulationsSidebar } from "@/features/simulations/components/SimulationsSidebar";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";
import { useSimulationFilters } from "@/features/simulations/hooks";
import {
  getSimulationReportsQueryOptions,
  useRunSimulationMutation,
} from "@/features/simulations/simulation/services";
import {
  zGetSimulationConfigurationResponse,
  zSimulationReport,
} from "@/lib/api";
import { cn } from "@/lib/styles";
import { queryClient } from "@/lib/tanstack";

import { DataCollectionSettings } from "./DataCollectionSettings";
import { DistributionDisplay } from "./DistributionDisplay";
import { SimulationMetadata } from "./SimulationMetadata";
import { SimulationParameters } from "./SimulationParameters";
import { SimulationReportCard } from "./SimulationReportCard";

interface Props {
  simulation: z.infer<typeof zGetSimulationConfigurationResponse>;

  reports: Array<z.infer<typeof zSimulationReport>>;
}

export const SimulationView = ({ simulation, reports }: Props) => {
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

  const runSimulationMutation = useRunSimulationMutation({
    onSuccess: () => {
      // Invalidate reports query to refresh the list

      queryClient.invalidateQueries({
        queryKey: getSimulationReportsQueryOptions(simulation.id).queryKey,
      });

      // Invalidate simulations list to update any status indicators

      queryClient.invalidateQueries({
        queryKey: getSimulationsQueryKeys(),
      });
    },
  });

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: getSimulationsQueryKeys(),
    });
  };

  const handleRunSimulation = () => {
    runSimulationMutation.mutate(simulation.id);
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

  const activeReports = reports.filter((report) => report.is_active);

  return (
    <SidebarProvider>
      <SimulationsFiltersContext.Provider value={filtersContextValue}>
        <SimulationsSidebar activeSimulationId={simulation.id} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col min-w-0">
                  <h1 className="text-lg font-semibold truncate">
                    {simulation.name}
                  </h1>
                  {simulation.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {simulation.description}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
                    simulation.is_active
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-400",
                  )}
                >
                  {simulation.is_active
                    ? t(($) => $.simulationView.header.active)
                    : t(($) => $.simulationView.header.archived)}
                </span>
              </div>
              {simulation.is_active && (
                <Button
                  onClick={handleRunSimulation}
                  isLoading={runSimulationMutation.isPending}
                  disabled={runSimulationMutation.isPending}
                  size="sm"
                >
                  {runSimulationMutation.isPending
                    ? t(($) => $.simulationView.actions.runningSimulation)
                    : t(($) => $.simulationView.actions.runSimulation)}
                </Button>
              )}
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            {runSimulationMutation.isSuccess && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  {t(($) => $.simulationView.actions.runSuccess)}
                </p>
              </div>
            )}
            {runSimulationMutation.isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {t(($) => $.simulationView.actions.runError)}
                </p>
              </div>
            )}
            <SimulationMetadata simulation={simulation} />
            <SimulationParameters
              parameters={simulation.simulation_parameters}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DistributionDisplay
                title={t(($) => $.distributions.arrivalProcess.title)}
                description={t(
                  ($) => $.distributions.arrivalProcess.description,
                )}
                distribution={simulation.simulation_parameters.arrivalProcess}
              />
              <DistributionDisplay
                title={t(($) => $.distributions.serviceProcess.title)}
                description={t(
                  ($) => $.distributions.serviceProcess.description,
                )}
                distribution={simulation.simulation_parameters.serviceProcess}
              />
            </div>
            <DataCollectionSettings
              parameters={simulation.simulation_parameters}
            />
            <Separator className="my-2" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {t(($) => $.simulationView.sections.reports.title)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t(($) => $.simulationView.sections.reports.description)}
                  </p>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {t(($) => $.simulationView.sections.reports.count, {
                    count: activeReports.length,
                  })}
                </span>
              </div>
              {activeReports.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>
                      {t(
                        ($) =>
                          $.simulationView.sections.reports.noReports.title,
                      )}
                    </EmptyTitle>
                    <EmptyDescription>
                      {t(
                        ($) =>
                          $.simulationView.sections.reports.noReports
                            .description,
                      )}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {activeReports.map((report) => (
                    <SimulationReportCard
                      key={report.id}
                      report={report}
                      simulationId={simulation.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </SimulationsFiltersContext.Provider>
    </SidebarProvider>
  );
};
