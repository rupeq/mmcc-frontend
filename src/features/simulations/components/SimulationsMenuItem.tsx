import { z } from "zod";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui";
import { zSimulationConfigurationInfo } from "@/lib/api";

interface Props {
  simulation: z.infer<typeof zSimulationConfigurationInfo>;
  isLastItem: boolean;
  lastSimulationRef: (node: HTMLLIElement | null) => void;
}

export const SimulationsMenuItem = ({
  simulation,
  isLastItem,
  lastSimulationRef,
}: Props) => {
  return (
    <SidebarMenuItem
      key={simulation.id}
      ref={isLastItem ? lastSimulationRef : undefined}
    >
      <SidebarMenuButton
        tooltip={simulation.description ?? undefined}
        className="cursor-pointer"
      >
        <span className="truncate">{simulation.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
