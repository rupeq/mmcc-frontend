import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Separator } from "@/components/ui";
import {
  zGetSimulationConfigurationReportResponse,
  zReportStatus,
} from "@/lib/api";
import { dateFormat } from "@/lib/i18n";
import { cn } from "@/lib/styles";

interface Props {
  report: z.infer<typeof zGetSimulationConfigurationReportResponse>;
}

export const ReportMetadata = ({ report }: Props) => {
  const { t } = useTranslation(["reports", "simulations"]);

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
      label: t(($) => $.simulationView.statuses.pending, {
        ns: "simulations",
      }),
      className: "text-yellow-600",
    },
    running: {
      icon: Clock,
      label: t(($) => $.simulationView.statuses.running, {
        ns: "simulations",
      }),
      className: "text-blue-600",
    },
    completed: {
      icon: CheckCircle,
      label: t(($) => $.simulationView.statuses.completed, {
        ns: "simulations",
      }),
      className: "text-green-600",
    },
    failed: {
      icon: XCircle,
      label: t(($) => $.simulationView.statuses.failed, {
        ns: "simulations",
      }),
      className: "text-red-600",
    },
    cancelled: {
      icon: AlertCircle,
      label: t(($) => $.simulationView.statuses.cancelled, {
        ns: "simulations",
      }),
      className: "text-gray-600",
    },
  };

  const config = statusConfig[report.status];
  const Icon = config.icon;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground px-1">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5", config.className)} />
        <span>{t(($) => $.reportView.metadata.status)}</span>
        <span className={cn("font-medium", config.className)}>
          {config.label}
        </span>
      </div>

      <Separator orientation="vertical" className="h-4" />

      <div className="flex items-center gap-1.5">
        <Calendar className="size-3.5" />
        <span>{t(($) => $.reportView.metadata.created)}</span>
        <span className="font-medium text-foreground">
          {dateFormat(new Date(report.created_at), "PPp")}
        </span>
      </div>

      {report.completed_at && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            <span>{t(($) => $.reportView.metadata.completed)}</span>
            <span className="font-medium text-foreground">
              {dateFormat(new Date(report.completed_at), "PPp")}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
