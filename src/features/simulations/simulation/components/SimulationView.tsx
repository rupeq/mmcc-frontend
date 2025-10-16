import { format } from "date-fns";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui";
import { getSimulationsQueryKeys } from "@/features/simulations";
import { SimulationsSidebar } from "@/features/simulations/components/SimulationsSidebar";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";
import { useSimulationFilters } from "@/features/simulations/hooks";
import {
  zGetSimulationConfigurationResponse,
  zSimulationReport,
} from "@/lib/api";
import { queryClient } from "@/lib/tanstack";

import { SimulationReportCard } from "./SimulationReportCard";

interface Props {
  simulation: z.infer<typeof zGetSimulationConfigurationResponse>;
  reports: Array<z.infer<typeof zSimulationReport>>;
}

export const SimulationView = ({ simulation, reports }: Props) => {
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

  const activeReports = reports.filter((report) => report.is_active);

  return (
    <SidebarProvider>
      <SimulationsFiltersContext.Provider value={filtersContextValue}>
        <SimulationsSidebar activeSimulationId={simulation.id} />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">{simulation.name}</h1>
              {simulation.description && (
                <p className="text-sm text-muted-foreground">
                  {simulation.description}
                </p>
              )}
            </div>
          </header>
          <main className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
                <CardDescription>
                  Basic information about this simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm text-muted-foreground">
                    {simulation.created_at
                      ? format(new Date(simulation.created_at), "PPp")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm text-muted-foreground">
                    {simulation.updated_at
                      ? format(new Date(simulation.updated_at), "PPp")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-muted-foreground">
                    {simulation.is_active ? "Active" : "Archived"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Reports</h2>
                <span className="text-sm text-muted-foreground">
                  {activeReports.length}{" "}
                  {activeReports.length === 1 ? "report" : "reports"}
                </span>
              </div>

              {activeReports.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No Reports Yet</EmptyTitle>
                    <EmptyDescription>
                      This simulation doesn't have any reports yet.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
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
