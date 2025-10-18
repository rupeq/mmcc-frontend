import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["simulations"]);
  const deleteMutation = useDeleteSimulationMutation({
    onSuccess: () => {
      onDeleteSuccess?.();
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(t(($) => $.menu.deleteConfirm, { name: simulation.name }))
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
          <span className="truncate">
            {t(($) => $.menu.archived)} {simulation.name}
          </span>
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
