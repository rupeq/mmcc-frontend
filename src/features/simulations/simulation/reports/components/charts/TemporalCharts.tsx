import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { getTemporalChartsQueryOptions } from "@/features/simulations/simulation/reports/services/charts";
import type { zSimulationRequestOutput } from "@/lib/api";

import { ChartDisplay } from "./ChartDisplay";

interface Props {
  simulationId: string;
  reportId: string;
  parameters: z.infer<typeof zSimulationRequestOutput>;
}

export const TemporalCharts = ({
  simulationId,
  reportId,
  parameters,
}: Props) => {
  const { t } = useTranslation(["reports"]);

  const dataWasCollected = parameters.collectTemporalProfile ?? false;

  const chartsQuery = useQuery(
    getTemporalChartsQueryOptions(simulationId, reportId, dataWasCollected),
  );

  if (!dataWasCollected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t(($) => $.charts.temporal.title)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-200">
            <Info className="size-6" />
            <div className="flex-1">
              <h4 className="font-semibold">
                {t(($) => $.charts.temporal.dataNotCollected.title)}
              </h4>
              <p className="text-sm">
                {t(($) => $.charts.temporal.dataNotCollected.description)}
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
        <CardTitle>{t(($) => $.charts.temporal.title)}</CardTitle>
        <CardDescription>
          {t(($) => $.charts.temporal.description)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="utilization_timeseries">
          <TabsList>
            <TabsTrigger value="utilization_timeseries">
              {t(($) => $.charts.temporal.utilization_timeseries)}
            </TabsTrigger>
            <TabsTrigger value="busy_idle_distributions">
              {t(($) => $.charts.temporal.busy_idle_distributions)}
            </TabsTrigger>
            {chartsQuery.data?.phase_comparison && (
              <TabsTrigger value="phase_comparison">
                {t(($) => $.charts.temporal.phase_comparison)}
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="utilization_timeseries" className="pt-4">
            <ChartDisplay
              isLoading={chartsQuery.isLoading}
              error={chartsQuery.error}
              base64Image={chartsQuery.data?.utilization_timeseries}
              altText={t(($) => $.charts.temporal.utilization_timeseries)}
            />
          </TabsContent>
          <TabsContent value="busy_idle_distributions" className="pt-4">
            <ChartDisplay
              isLoading={chartsQuery.isLoading}
              error={chartsQuery.error}
              base64Image={chartsQuery.data?.busy_idle_distributions}
              altText={t(($) => $.charts.temporal.busy_idle_distributions)}
            />
          </TabsContent>
          {chartsQuery.data?.phase_comparison && (
            <TabsContent value="phase_comparison" className="pt-4">
              <ChartDisplay
                isLoading={chartsQuery.isLoading}
                error={chartsQuery.error}
                base64Image={chartsQuery.data?.phase_comparison}
                altText={t(($) => $.charts.temporal.phase_comparison)}
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
