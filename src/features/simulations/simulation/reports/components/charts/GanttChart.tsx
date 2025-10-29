import { useEffect, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { Download, Info, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getGanttChartBlob } from "@/features/simulations/simulation/reports/services/charts";
import type { zSimulationRequestOutput } from "@/lib/api";

interface Props {
  simulationId: string;
  reportId: string;
  parameters: z.infer<typeof zSimulationRequestOutput>;
}

export const GanttChart = ({ simulationId, reportId, parameters }: Props) => {
  const { t } = useTranslation(["reports"]);

  const dataWasCollected = parameters.collectGanttData ?? false;

  const ganttChartQuery = useQuery({
    queryKey: ["ganttChart", simulationId, reportId],
    queryFn: () => getGanttChartBlob(simulationId, reportId),
    enabled: dataWasCollected,
    staleTime: Infinity,
  });

  const imageUrl = useMemo(() => {
    if (ganttChartQuery.data) {
      return URL.createObjectURL(ganttChartQuery.data);
    }
    return null;
  }, [ganttChartQuery.data]);

  useEffect(() => {
    // Clean up the object URL when the component unmounts or the URL changes
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `gantt-chart-${reportId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!dataWasCollected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t(($) => $.charts.gantt.title)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-200">
            <Info className="size-6" />
            <div className="flex-1">
              <h4 className="font-semibold">
                {t(($) => $.charts.gantt.dataNotCollected.title)}
              </h4>
              <p className="text-sm">
                {t(($) => $.charts.gantt.dataNotCollected.description)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t(($) => $.charts.gantt.title)}</CardTitle>
            <CardDescription>
              {t(($) => $.charts.gantt.description)}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!imageUrl}
          >
            <Download className="mr-2 size-4" />
            {t(($) => $.charts.download)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {ganttChartQuery.isLoading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin size-8 text-muted-foreground" />
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={t(($) => $.charts.gantt.title)}
            className="block w-full h-auto rounded-md"
          />
        )}
      </CardContent>
    </Card>
  );
};
