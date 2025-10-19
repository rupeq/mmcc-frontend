import { Activity, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { zAggregatedMetrics } from "@/lib/api";

interface Props {
  metrics: z.infer<typeof zAggregatedMetrics>;
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  confidenceInterval,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  confidenceInterval?: { lower_bound: number; upper_bound: number };
}) => {
  const { t } = useTranslation(["reports"]);

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="rounded-md bg-muted/40 p-2">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold leading-none">{value}</p>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {confidenceInterval && (
          <p className="text-xs text-muted-foreground">
            {t(($) => $.metrics.confidenceInterval, {
              lowerBound: confidenceInterval.lower_bound.toFixed(4),
              upperBound: confidenceInterval.upper_bound.toFixed(4),
            })}
          </p>
        )}
      </div>
    </div>
  );
};
export const ReportAggregatedMetrics = ({ metrics }: Props) => {
  const { t } = useTranslation(["reports"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(($) => $.aggregatedResults.title)}</CardTitle>
        <CardDescription>
          {t(($) => $.aggregatedResults.description, {
            count: metrics.num_replications,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            icon={Users}
            label={t(($) => $.metrics.totalRequests)}
            value={metrics.total_requests.toLocaleString()}
            subtitle={t(($) => $.metrics.processedRejected, {
              processed: metrics.processed_requests.toLocaleString(),
              rejected: metrics.rejected_requests.toLocaleString(),
            })}
          />
          <MetricCard
            icon={TrendingDown}
            label={t(($) => $.metrics.rejectionProbability)}
            value={`${(metrics.rejection_probability * 100).toFixed(2)}%`}
            confidenceInterval={metrics.rejection_probability_ci ?? undefined}
          />
          <MetricCard
            icon={Activity}
            label={t(($) => $.metrics.avgChannelUtilization)}
            value={`${(metrics.avg_channel_utilization * 100).toFixed(2)}%`}
            confidenceInterval={metrics.avg_channel_utilization_ci ?? undefined}
          />
          <MetricCard
            icon={TrendingUp}
            label={t(($) => $.metrics.throughput)}
            value={metrics.throughput.toFixed(4)}
            subtitle={t(($) => $.metrics.throughputUnit)}
            confidenceInterval={metrics.throughput_ci ?? undefined}
          />
        </div>
      </CardContent>
    </Card>
  );
};
