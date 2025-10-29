import { useState } from "react";

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
import { BatchReportsGroup } from "@/features/simulations/simulation/components/BatchReportsGroup";
import { SweepConfigurationDialog } from "@/features/simulations/simulation/components/SweepConfigurationDialog";
import {
  getSimulationReportsQueryOptions,
  useRunSimulationMutation,
} from "@/features/simulations/simulation/services";
import {
  zGetSimulationConfigurationResponse,
  zSimulationReport,
} from "@/lib/api";
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

  const [isSweepDialogOpen, setIsSweepDialogOpen] = useState<boolean>(false);

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
      queryClient.invalidateQueries({
        queryKey: getSimulationReportsQueryOptions(simulation.id).queryKey,
      });

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
  const groupedReports = activeReports.reduce(
    (acc, report) => {
      if (report.batch_id) {
        if (!acc.batches[report.batch_id]) {
          acc.batches[report.batch_id] = [];
        }
        acc.batches[report.batch_id].push(report);
      } else {
        acc.individual.push(report);
      }
      return acc;
    },
    {
      batches: {} as Record<string, typeof activeReports>,
      individual: [] as typeof activeReports,
    },
  );

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
              </div>
              {simulation.is_active && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsSweepDialogOpen(true)}
                    size="sm"
                  >
                    {t(($) => $.simulationView.actions.parameterSweep)}
                  </Button>
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
                </div>
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
                <div className="space-y-6">
                  {Object.entries(groupedReports.batches).map(
                    ([batchId, batchReports]) => {
                      const firstReport = batchReports[0];
                      return (
                        <BatchReportsGroup
                          key={batchId}
                          batchId={batchId}
                          reports={batchReports}
                          simulationId={simulation.id}
                          parameterName={
                            firstReport?.sweep_parameter_name ?? undefined
                          }
                        />
                      );
                    },
                  )}
                  {groupedReports.individual.length > 0 && (
                    <>
                      {Object.keys(groupedReports.batches).length > 0 && (
                        <Separator className="my-6" />
                      )}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {t(
                            ($) =>
                              $.simulationView.sections.reports
                                .individualReports,
                          )}
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {groupedReports.individual.map((report) => (
                            <SimulationReportCard
                              key={report.id}
                              report={report}
                              simulationId={simulation.id}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </SimulationsFiltersContext.Provider>
      <SweepConfigurationDialog
        simulation={simulation}
        open={isSweepDialogOpen}
        onOpenChange={setIsSweepDialogOpen}
      />
    </SidebarProvider>
  );
};
