import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Separator } from "@/components/ui";
import type { zGetSimulationConfigurationResponse } from "@/lib/api";
import { dateFormat } from "@/lib/i18n";

interface Props {
  simulation: z.infer<typeof zGetSimulationConfigurationResponse>;
}

export const SimulationMetadata = ({ simulation }: Props) => {
  const { t } = useTranslation(["simulations"]);

  if (!simulation.created_at && !simulation.updated_at) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground px-1">
      {simulation.created_at && (
        <>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>{t(($) => $.simulationView.sections.metadata.created)}</span>
            <span className="font-medium text-foreground">
              {dateFormat(new Date(simulation.created_at), "PP")}
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
          <span>{t(($) => $.simulationView.sections.metadata.updated)}</span>
          <span className="font-medium text-foreground">
            {dateFormat(new Date(simulation.updated_at), "PPp")}
          </span>
        </div>
      )}
    </div>
  );
};
