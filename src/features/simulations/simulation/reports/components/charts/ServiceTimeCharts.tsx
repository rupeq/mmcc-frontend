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
import { getServiceTimeVisualizationsQueryOptions } from "@/features/simulations/simulation/reports/services";
import type { zSimulationRequestOutput } from "@/lib/api";

import { ChartDisplay } from "./ChartDisplay";

interface Props {
  simulationId: string;
  reportId: string;
  parameters: z.infer<typeof zSimulationRequestOutput>;
}

export const ServiceTimeCharts = ({
  simulationId,
  reportId,
  parameters,
}: Props) => {
  const { t } = useTranslation(["reports"]);

  const dataWasCollected = parameters.collectServiceTimes ?? false;

  const chartsQuery = useQuery(
    getServiceTimeVisualizationsQueryOptions(
      simulationId,
      reportId,
      dataWasCollected,
    ),
  );

  if (!dataWasCollected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t(($) => $.charts.title)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-200">
            <Info className="size-6" />
            <div className="flex-1">
              <h4 className="font-semibold">
                {t(($) => $.charts.dataNotCollected.title)}
              </h4>
              <p className="text-sm">
                {t(($) => $.charts.dataNotCollected.description)}
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
        <CardTitle>{t(($) => $.charts.title)}</CardTitle>
        <CardDescription>{t(($) => $.charts.description)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="histogram">
          <TabsList>
            <TabsTrigger value="histogram">
              {t(($) => $.charts.histogram)}
            </TabsTrigger>
            <TabsTrigger value="ecdf">{t(($) => $.charts.ecdf)}</TabsTrigger>
            <TabsTrigger value="qq_plot">
              {t(($) => $.charts.qq_plot)}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="histogram" className="pt-4">
            <ChartDisplay
              isLoading={chartsQuery.isLoading}
              error={chartsQuery.error}
              base64Image={chartsQuery.data?.histogram.image_base64}
              altText={t(($) => $.charts.histogram)}
            />
          </TabsContent>
          <TabsContent value="ecdf" className="pt-4">
            <ChartDisplay
              isLoading={chartsQuery.isLoading}
              error={chartsQuery.error}
              base64Image={chartsQuery.data?.ecdf.image_base64}
              altText={t(($) => $.charts.ecdf)}
            />
          </TabsContent>
          <TabsContent value="qq_plot" className="pt-4">
            <ChartDisplay
              isLoading={chartsQuery.isLoading}
              error={chartsQuery.error}
              base64Image={chartsQuery.data?.qq_plot?.image_base64}
              altText={t(($) => $.charts.qq_plot)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
