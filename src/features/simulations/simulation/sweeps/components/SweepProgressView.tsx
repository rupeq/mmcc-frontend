import { CheckCircle, Clock, XCircle } from "lucide-react";
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
import { zSweepResponse } from "@/lib/api";
import { cn } from "@/lib/styles";

interface Props {
  sweepData: z.infer<typeof zSweepResponse>;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending" as const,
    className: "text-yellow-600",
  },
  running: {
    icon: Clock,
    label: "Running" as const,
    className: "text-blue-600 animate-spin",
  },
  completed: {
    icon: CheckCircle,
    label: "Done" as const,
    className: "text-green-600",
  },
  failed: {
    icon: XCircle,
    label: "Failed" as const,
    className: "text-red-600",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled" as const,
    className: "text-gray-600",
  },
};

export const SweepProgressView = ({ sweepData }: Props) => {
  const { t } = useTranslation(["simulations"]);

  const progressPercent = Math.round(
    ((sweepData.completed + sweepData.failed) /
      sweepData.total_parameter_values) *
      100,
  );

  const isComplete =
    sweepData.completed + sweepData.failed === sweepData.total_parameter_values;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {t(($) => $.sweep.progress.title)}: {sweepData.parameter_name}
          </CardTitle>
          <CardDescription>
            {t(($) => $.sweep.progress.description)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {t(($) => $.sweep.progress.progress)}
              </span>
              <span className="text-muted-foreground">
                {sweepData.completed + sweepData.failed}/
                {sweepData.total_parameter_values} ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  isComplete ? "bg-green-600" : "bg-blue-600",
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {t(($) => $.sweep.progress.results)}
            </h4>
            <div className="space-y-2">
              {sweepData.results.map((result) => {
                const config = statusConfig[result.status];
                const Icon = config.icon;

                return (
                  <div
                    key={result.report_id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("size-4", config.className)} />
                      <div>
                        <p className="text-sm font-medium">
                          {sweepData.parameter_name} ={" "}
                          {String(result.parameter_value)}
                        </p>
                        {result.metrics && (
                          <p className="text-xs text-muted-foreground">
                            {t(($) => $.sweep.progress.rejectionRate)}:{" "}
                            {(
                              result.metrics.rejection_probability * 100
                            ).toFixed(2)}
                            %
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn("text-xs font-medium", config.className)}
                    >
                      {t(($) => $.sweep.progress.status[config.label])}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
