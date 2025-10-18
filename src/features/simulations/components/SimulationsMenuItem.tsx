import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { z } from "zod";

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui";
import { useDeleteSimulationMutation } from "@/features/simulations/services";
import { zSimulationConfigurationInfo } from "@/lib/api";

interface Props {
  simulation: z.infer<typeof zSimulationConfigurationInfo>;
  isLastItem: boolean;
  lastSimulationRef: (node: HTMLLIElement | null) => void;
  onDeleteSuccess?: () => void;
  isActive?: boolean;
}

export const SimulationsMenuItem = ({
  simulation,
  isLastItem,
  lastSimulationRef,
  onDeleteSuccess,
  isActive = false,
}: Props) => {
  const deleteMutation = useDeleteSimulationMutation({
    onSuccess: () => {
      onDeleteSuccess?.();
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete "${simulation.name}"? This action cannot be undone.`,
      )
    ) {
      deleteMutation.mutate(simulation.id);
    }
  };

  return (
    <SidebarMenuItem
      key={simulation.id}
      ref={isLastItem ? lastSimulationRef : undefined}
    >
      <SidebarMenuButton
        tooltip={simulation.description ?? undefined}
        asChild
        isActive={isActive}
      >
        {simulation.is_active ? (
          <Link
            to="/simulations/$simulationId"
            params={{ simulationId: simulation.id }}
          >
            <span className="truncate">{simulation.name}</span>
          </Link>
        ) : (
          <span className="truncate">(Archived) {simulation.name}</span>
        )}
      </SidebarMenuButton>
      {simulation.is_active && (
        <SidebarMenuAction
          className="cursor-pointer"
          showOnHover={true}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          aria-label={`Delete ${simulation.name}`}
        >
          <Trash2 className="size-4" />
        </SidebarMenuAction>
      )}
    </SidebarMenuItem>
  );
};
