import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui";
import { useSimulationsSearch } from "@/features/simulations/hooks";

import { Sidebar } from "./Sidebar";

interface Props {
  defaultSearch?: string;
}

export const Simulations = ({ defaultSearch }: Props) => {
  const { search, simulations, simulationsQuery, handleSearchChange } =
    useSimulationsSearch(defaultSearch);

  return (
    <SidebarProvider>
      <Sidebar
        search={search}
        onSearchChange={handleSearchChange}
        simulations={simulations}
        isLoading={simulationsQuery.isLoading}
        isFetchingNextPage={simulationsQuery.isFetchingNextPage}
        hasNextPage={simulationsQuery.hasNextPage ?? false}
        onLoadMore={() => simulationsQuery.fetchNextPage()}
      />
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
