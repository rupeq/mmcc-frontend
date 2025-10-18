import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { z } from "zod";

import { Separator } from "@/components/ui";
import type { zGetSimulationConfigurationResponse } from "@/lib/api";

interface Props {
  simulation: z.infer<typeof zGetSimulationConfigurationResponse>;
}

export const SimulationMetadata = ({ simulation }: Props) => {
  if (!simulation.created_at && !simulation.updated_at) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground px-1">
      {simulation.created_at && (
        <>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>Created</span>
            <span className="font-medium text-foreground">
              {format(new Date(simulation.created_at), "PP")}
            </span>
          </div>
          {simulation.updated_at && (
            <Separator orientation="vertical" className="h-4" />
          )}
        </>
      )}
      {simulation.updated_at && (
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5" />
          <span>Updated</span>
          <span className="font-medium text-foreground">
            {format(new Date(simulation.updated_at), "PP 'at' p")}
          </span>
        </div>
      )}
    </div>
  );
};
