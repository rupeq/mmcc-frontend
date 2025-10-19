import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Button,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui";
import { SimulationsSidebar } from "@/features/simulations/components/SimulationsSidebar";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";
import { useSimulationFilters } from "@/features/simulations/hooks";
import { getSimulationsQueryKeys } from "@/features/simulations/services";
import {
  zGetSimulationConfigurationReportResponse,
  zGetSimulationConfigurationResponse,
} from "@/lib/api";
import { queryClient } from "@/lib/tanstack";

import { ReportAggregatedMetrics } from "./ReportAggregatedMetrics";
import { ReportMetadata } from "./ReportMetadata";
import { ReportReplications } from "./ReportReplications";

interface Props {
  simulation: z.infer<typeof zGetSimulationConfigurationResponse>;
  report: z.infer<typeof zGetSimulationConfigurationReportResponse>;
}

export const ReportView = ({ simulation, report }: Props) => {
  const { t } = useTranslation(["simulations", "reports"]);

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

  return (
    <SidebarProvider>
      <SimulationsFiltersContext.Provider value={filtersContextValue}>
        <SimulationsSidebar activeSimulationId={simulation.id} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  to="/simulations/$simulationId"
                  params={{ simulationId: simulation.id }}
                >
                  <Button variant="ghost" size="smIcon">
                    <ArrowLeft />
                  </Button>
                </Link>
                <div className="flex flex-col min-w-0">
                  <h1 className="text-lg font-semibold truncate">
                    {simulation.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Report #{report.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <ReportMetadata report={report} />
            {report.error_message && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {report.error_message}
                </p>
              </div>
            )}
            {report.results && "aggregated_metrics" in report.results && (
              <>
                <ReportAggregatedMetrics
                  metrics={report.results.aggregated_metrics}
                />
                <Separator />
                <ReportReplications
                  replications={report.results.replications}
                  simulationParameters={simulation.simulation_parameters}
                />
              </>
            )}
            {report.results && "results" in report.results && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  {t(($) => $.reports.reportView.sweepNotSupported)}
                </p>
              </div>
            )}
          </main>
        </SidebarInset>
      </SimulationsFiltersContext.Provider>
    </SidebarProvider>
  );
};
