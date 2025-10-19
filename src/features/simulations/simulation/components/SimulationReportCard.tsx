import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { zReportStatus, zSimulationReport } from "@/lib/api";
import { dateFormat } from "@/lib/i18n";
import { cn } from "@/lib/styles";

interface Props {
  report: z.infer<typeof zSimulationReport>;
  simulationId: string;
}

export const SimulationReportCard = ({ report, simulationId }: Props) => {
  const { t } = useTranslation(["simulations"]);

  const statusConfig: Record<
    z.infer<typeof zReportStatus>,
    {
      icon: typeof Clock;
      label: string;
      className: string;
    }
  > = {
    pending: {
      icon: Clock,
      label: t(($) => $.simulationView.statuses.pending),
      className: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950",
    },
    running: {
      icon: Clock,
      label: t(($) => $.simulationView.statuses.running),
      className: "text-blue-600 bg-blue-50 dark:bg-blue-950",
    },
    completed: {
      icon: CheckCircle,
      label: t(($) => $.simulationView.statuses.completed),
      className: "text-green-600 bg-green-50 dark:bg-green-950",
    },
    failed: {
      icon: XCircle,
      label: t(($) => $.simulationView.statuses.failed),
      className: "text-red-600 bg-red-50 dark:bg-red-950",
    },
    cancelled: {
      icon: AlertCircle,
      label: t(($) => $.simulationView.statuses.cancelled),
      className: "text-gray-600 bg-gray-50 dark:bg-gray-950",
    },
  };

  const config = statusConfig[report.status];
  const Icon = config.icon;

  return (
    <Link
      to="/simulations/$simulationId/reports/$reportId"
      params={{ simulationId, reportId: report.id }}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {t(($) => $.simulationView.sections.reports.reportNumber, {
                id: report.id.slice(0, 8),
              })}
            </CardTitle>
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                config.className,
              )}
            >
              <Icon className="size-3" />
              {config.label}
            </div>
          </div>
          <CardDescription>
            {t(($) => $.simulationView.sections.reports.createdAt, {
              date: dateFormat(new Date(report.created_at), "PPp"),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {report.completed_at && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t(($) => $.simulationView.sections.reports.completed)}
              </span>
              <span>{dateFormat(new Date(report.completed_at), "PPp")}</span>
            </div>
          )}
          {report.error_message && (
            <div className="text-sm text-red-600 dark:text-red-400">
              <span className="font-medium">
                {t(($) => $.simulationView.sections.reports.error)}
              </span>{" "}
              {report.error_message}
            </div>
          )}
          {report.results && (
            <div className="text-sm text-muted-foreground">
              {t(($) => $.simulationView.sections.reports.resultsAvailable)}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
