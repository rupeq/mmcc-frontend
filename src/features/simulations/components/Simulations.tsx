import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui";
import { SimulationsSearchContext } from "@/features/simulations/contexts";
import { useSimulationsSearch } from "@/features/simulations/hooks";

import { SimulationsSidebar } from "./SimulationsSidebar";

interface Props {
  defaultSearch?: string;
}

export const Simulations = ({ defaultSearch }: Props) => {
  const { search, simulations, simulationsQuery, handleSearchChange } =
    useSimulationsSearch(defaultSearch);

  const handleLoadMore = () => simulationsQuery.fetchNextPage();

  return (
    <SidebarProvider>
      <SimulationsSearchContext.Provider
        value={{
          simulations,
          onLoadMore: handleLoadMore,
          isLoading: simulationsQuery.isLoading,
          isFetchingNextPage: simulationsQuery.isFetchingNextPage,
          hasNextPage: simulationsQuery.hasNextPage,
        }}
      >
        <SimulationsSidebar
          search={search}
          onSearchChange={handleSearchChange}
        />
      </SimulationsSearchContext.Provider>
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
    </SidebarProvider>
  );
};
