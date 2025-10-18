import { use, useRef, useState } from "react";

import { Funnel } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui";
import { UserMenu } from "@/components/UserMenu";
import { CreateSimulationForm } from "@/features/simulations/components/CreateSimulationForm";
import { SimulationFilters } from "@/features/simulations/components/SimulationFilters";
import { SimulationsMenu } from "@/features/simulations/components/SimulationsMenu";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";

interface Props {
  activeSimulationId?: string;
}

export const SimulationsSidebar = ({ activeSimulationId }: Props) => {
  const { t } = useTranslation(["simulations"]);
  const observerTarget = useRef<HTMLLIElement>(null);
  const [isFiltersPopoverOpen, setIsFiltersPopoverOpen] = useState(false);

  const {
    search,
    reportStatus,
    showArchived,
    simulations,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    setSearch,
    clearFilters,
    loadMore,
  } = use(SimulationsFiltersContext);

  const lastSimulationRef = (node: HTMLLIElement | null) => {
    if (isFetchingNextPage) {
      return;
    }

    if (observerTarget.current) {
      observerTarget.current = null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          loadMore();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    if (node) {
      observer.observe(node);
      observerTarget.current = node;
    }

    return () => {
      if (observerTarget.current) {
        observer.disconnect();
      }
    };
  };

  const hasFilters = !!reportStatus || showArchived !== undefined;

  return (
    <SidebarRoot>
      <SidebarHeader>
        <Dialog>
          <DialogTrigger asChild={true}>
            <Button size="sm" variant="outline">
              {t(($) => $.sidebar.createButton)}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateSimulationForm />
          </DialogContent>
        </Dialog>
        <div className="flex flex-row gap-2">
          <Input
            placeholder={t(($) => $.sidebar.search.placeholder)}
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />
          <Popover
            open={isFiltersPopoverOpen}
            onOpenChange={setIsFiltersPopoverOpen}
          >
            <PopoverTrigger asChild={true}>
              <Button
                variant="outline"
                size="icon"
                aria-label="Filters"
                className={hasFilters ? "border-blue-600" : ""}
              >
                <Funnel className={hasFilters ? "text-blue-600" : ""} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <SimulationFilters
                onClose={() => setIsFiltersPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SimulationsMenu
                lastSimulationRef={lastSimulationRef}
                hasFilters={hasFilters}
                onFiltersClear={clearFilters}
                activeSimulationId={activeSimulationId}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && simulations.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs text-muted-foreground pointer-events-none select-none">
              {t(($) => $.sidebar.scroll.totalSimulations, {
                count: simulations.length,
              })}
              {hasNextPage && t(($) => $.sidebar.scroll.nextPageLabel)}
            </div>
            <Separator />
          </>
        )}
        <UserMenu />
      </SidebarFooter>
    </SidebarRoot>
  );
};
