import { useState } from "react";

import { useRouter } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  ExternalLinkIcon,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { SimulationReportCard } from "@/features/simulations/simulation/components/SimulationReportCard";
import type { zSimulationReport } from "@/lib/api";
import { dateFormat } from "@/lib/i18n";

interface Props {
  batchId: string;
  reports: Array<z.infer<typeof zSimulationReport>>;
  simulationId: string;
  parameterName?: string;
}

export const BatchReportsGroup = ({
  batchId,
  reports,
  simulationId,
  parameterName,
}: Props) => {
  const { t } = useTranslation(["simulations"]);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = reports.filter((r) => r.status === "completed").length;
  const failedCount = reports.filter((r) => r.status === "failed").length;
  const runningCount = reports.filter((r) => r.status === "running").length;
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  const firstReport = reports[0];
  const createdDate = firstReport
    ? dateFormat(new Date(firstReport.created_at), "PPp")
    : "";

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-950">
              <Package className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg flex flex-row gap-2 items-center">
                {t(($) => $.simulationView.sections.reports.sweepBatch.title)}
                <Button
                  variant="link"
                  size="smIcon"
                  onClick={() => {
                    window.open(
                      router.buildLocation({
                        to: "/simulations/$simulationId/sweeps/$batchId",
                        params: { simulationId, batchId },
                      }).url,
                      "_blank",
                      "noopener noreferrer",
                    );
                  }}
                >
                  <ExternalLinkIcon onClick={() => {}} />
                </Button>
              </CardTitle>
              <CardDescription>
                {parameterName && (
                  <>
                    {t(
                      ($) =>
                        $.simulationView.sections.reports.sweepBatch.parameter,
                    )}
                    : <span className="font-medium">{parameterName}</span>{" "}
                    •{" "}
                  </>
                )}
                {createdDate}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {completedCount > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {completedCount}{" "}
                {t(($) => $.sweep.progress.status_cnt.Done, {
                  count: completedCount,
                }).toLowerCase()}
              </Badge>
            )}
            {runningCount > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {runningCount}{" "}
                {t(($) => $.sweep.progress.status_cnt.Running, {
                  count: runningCount,
                }).toLowerCase()}
              </Badge>
            )}
            {pendingCount > 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {pendingCount}{" "}
                {t(($) => $.sweep.progress.status_cnt.Pending, {
                  count: pendingCount,
                }).toLowerCase()}
              </Badge>
            )}
            {failedCount > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {failedCount}{" "}
                {t(($) => $.sweep.progress.status_cnt.Failed, {
                  count: failedCount,
                }).toLowerCase()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between rounded-lg p-3 text-sm font-medium transition-colors hover:bg-muted cursor-pointer"
        >
          <span>
            {t(
              ($) => $.simulationView.sections.reports.sweepBatch.viewReports,
              {
                count: reports.length,
              },
            )}
          </span>
          {isExpanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {reports.map((report) => (
              <SimulationReportCard
                key={report.id}
                report={report}
                simulationId={simulationId}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
