import { useState } from "react";

import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui";
import { SimulationsSidebar } from "@/features/simulations/components/SimulationsSidebar";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";
import { useSimulationFilters } from "@/features/simulations/hooks";
import type { OptimizationResult } from "@/features/simulations/optimization/services";
import { getSimulationsQueryKeys } from "@/features/simulations/services";
import { queryClient } from "@/lib/tanstack";

import { OptimizationForm } from "./OptimizationForm";
import { OptimizationResults } from "./OptimizationResults";

export const OptimizationView = () => {
  const { t } = useTranslation(["optimization"]);
  const [result, setResult] = useState<OptimizationResult | null>(null);

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

  const handleOptimizationSuccess = (
    optimizationResult: OptimizationResult,
  ) => {
    setResult(optimizationResult);
  };

  const handleReset = () => {
    setResult(null);
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
        <SimulationsSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold">
                  {t(($) => $.view.title)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t(($) => $.view.subtitle)}
                </p>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:text-green-400 dark:ring-green-400/20">
                    {t(($) => $.view.completed)}
                  </span>
                </div>
              )}
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            {!result && (
              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                <Info className="size-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-900 dark:text-blue-100">
                  {t(($) => $.view.info.title)}
                </AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  {t(($) => $.view.info.description)}
                </AlertDescription>
              </Alert>
            )}

            {!result ? (
              <OptimizationForm onSuccess={handleOptimizationSuccess} />
            ) : (
              <OptimizationResults result={result} onReset={handleReset} />
            )}
          </main>
        </SidebarInset>
      </SimulationsFiltersContext.Provider>
    </SidebarProvider>
  );
};
