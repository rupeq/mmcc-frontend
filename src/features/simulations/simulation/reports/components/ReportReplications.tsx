import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { zSimulationRequestOutput, zSimulationResult } from "@/lib/api";

interface Props {
  replications: Array<z.infer<typeof zSimulationResult>>;
  simulationParameters: z.infer<typeof zSimulationRequestOutput>;
}

export const ReportReplications = ({
  replications,
  simulationParameters,
}: Props) => {
  const { t } = useTranslation(["reports"]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(($) => $.individualReplications.title)}</CardTitle>
        <CardDescription>
          {t(($) => $.individualReplications.description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {replications.map((replication, index) => (
          <div className="rounded-lg border" key={index}>
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50 cursor-pointer"
            >
              <div>
                <h4 className="font-medium">
                  {t(($) => $.individualReplications.replicationNumber, {
                    number: index + 1,
                  })}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t(($) => $.individualReplications.summary, {
                    processed: replication.metrics.processed_requests,
                    rejected: replication.metrics.rejected_requests,
                  })}
                </p>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="size-5" />
              ) : (
                <ChevronDown className="size-5" />
              )}
            </button>
            {expandedIndex === index && (
              <>
                <Separator />
                <div className="space-y-4 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t(($) => $.detailedMetrics.totalRequests)}
                      </p>
                      <p className="text-2xl font-bold">
                        {replication.metrics.total_requests}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t(($) => $.detailedMetrics.rejectionProbability)}
                      </p>
                      <p className="text-2xl font-bold">
                        {(
                          replication.metrics.rejection_probability * 100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t(($) => $.detailedMetrics.avgChannelUtilization)}
                      </p>
                      <p className="text-2xl font-bold">
                        {(
                          replication.metrics.avg_channel_utilization * 100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t(($) => $.detailedMetrics.throughput)}
                      </p>
                      <p className="text-2xl font-bold">
                        {replication.metrics.throughput.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  {simulationParameters.collectGanttData &&
                    replication.gantt_chart.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          {t(($) => $.dataCollection.ganttChart)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t(($) => $.dataCollection.ganttEvents, {
                            count: replication.gantt_chart.length,
                          })}
                        </p>
                      </div>
                    )}
                  {simulationParameters.collectServiceTimes &&
                    replication.raw_service_times &&
                    replication.raw_service_times.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          {t(($) => $.dataCollection.serviceTimes)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t(($) => $.dataCollection.samplesCollected, {
                            count: replication.raw_service_times.length,
                          })}
                        </p>
                      </div>
                    )}
                  {replication.temporal_profile && (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        {t(($) => $.dataCollection.temporalProfile)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(($) => $.dataCollection.timeWindows, {
                          count:
                            replication.temporal_profile.temporal_metrics
                              .length,
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
