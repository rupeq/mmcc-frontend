import {
  Activity,
  Download,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

interface OptimizationResultsProps {
  result: {
    optimal_channels: number;
    achieved_rejection_prob: number;
    achieved_utilization: number;
    throughput: number;
    total_cost?: number | null;
    iterations: number;
    convergence_history?: Array<Record<string, unknown>> | null;
  };
  onReset: () => void;
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  variant?: "default" | "success" | "warning" | "info";
}) => {
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-700 dark:text-green-400",
    warning: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    info: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-muted py-1">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div
              className={`inline-flex p-2.5 rounded-lg ${variantClasses[variant]}`}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold leading-none">{value}</p>
                {unit && (
                  <span className="text-sm text-muted-foreground">{unit}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const OptimizationResults = ({
  result,
  onReset,
}: OptimizationResultsProps) => {
  const { t } = useTranslation(["optimization"]);

  const handleExportCSV = () => {
    if (!result.convergence_history) return;

    const headers = Object.keys(result.convergence_history[0]);
    const rows = result.convergence_history.map((item) =>
      headers.map((h) => String(item[h] ?? "")),
    );

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimization-results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-green-600 dark:border-l-green-500 bg-green-50 dark:bg-green-950/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-1.5 flex-col">
              <CardTitle className="text-green-900 dark:text-green-100">
                {t(($) => $.results.optimal.title)}
              </CardTitle>
              <CardDescription className="text-green-800 dark:text-green-200">
                {t(($) => $.results.optimal.description, {
                  iterations: result.iterations,
                })}
              </CardDescription>
            </div>
            <Button onClick={onReset} variant="outline" size="sm">
              {t(($) => $.results.buttons.newOptimization)}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          label={t(($) => $.results.metrics.optimalChannels)}
          value={result.optimal_channels}
          variant="info"
        />
        <MetricCard
          icon={TrendingDown}
          label={t(($) => $.results.metrics.rejectionProb)}
          value={`${(result.achieved_rejection_prob * 100).toFixed(2)}%`}
          variant="warning"
        />
        <MetricCard
          icon={Activity}
          label={t(($) => $.results.metrics.utilization)}
          value={`${(result.achieved_utilization * 100).toFixed(2)}%`}
          variant="success"
        />
        <MetricCard
          icon={TrendingUp}
          label={t(($) => $.results.metrics.throughput)}
          value={result.throughput.toFixed(4)}
          unit={t(($) => $.results.metrics.throughputUnit)}
          variant="default"
        />
      </div>

      {/* Total Cost Card (if available) */}
      {result.total_cost !== null && result.total_cost !== undefined && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>{t(($) => $.results.cost.title)}</CardTitle>
            <CardDescription>
              {t(($) => $.results.cost.description)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">
                ${result.total_cost.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                {t(($) => $.results.cost.unit)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convergence History Table */}
      {result.convergence_history && result.convergence_history.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <CardTitle>{t(($) => $.results.convergence.title)}</CardTitle>
                <CardDescription>
                  {t(($) => $.results.convergence.description)}
                </CardDescription>
              </div>
              <Button onClick={handleExportCSV} variant="outline" size="sm">
                <Download className="mr-2 size-4" />
                {t(($) => $.results.buttons.export)}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {Object.keys(result.convergence_history[0]).map((key) => (
                        <TableHead key={key} className="font-semibold">
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.convergence_history
                      .slice(0, 10)
                      .map((item, idx) => (
                        <TableRow key={idx}>
                          {Object.values(item).map((value, vidx) => (
                            <TableCell key={vidx} className="font-mono text-sm">
                              {typeof value === "number"
                                ? value.toFixed(4)
                                : String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {result.convergence_history.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {t(($) => $.results.convergence.showingFirst, {
                    shown: 10,
                    total: result.convergence_history.length,
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
