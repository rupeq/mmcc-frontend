import { Link } from "@tanstack/react-router";
import { Download, TrendingDown, TrendingUp } from "lucide-react";
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
import { zSweepResponse } from "@/lib/api";

interface Props {
  sweepData: z.infer<typeof zSweepResponse>;
}

export const SweepResultsView = ({ sweepData }: Props) => {
  const { t } = useTranslation(["simulations"]);

  const completedResults = sweepData.results.filter(
    (r) => r.status === "completed" && r.metrics,
  );

  const handleExportCSV = () => {
    const headers = [
      sweepData.parameter_name,
      "Rejection Probability",
      "Utilization",
      "Throughput",
    ];

    const rows = completedResults.map((result) => [
      String(result.parameter_value),
      result.metrics!.rejection_probability.toFixed(4),
      result.metrics!.avg_channel_utilization.toFixed(4),
      result.metrics!.throughput.toFixed(4),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sweep-${sweepData.batch_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (completedResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t(($) => $.sweep.results.title)}</CardTitle>
          <CardDescription>
            {t(($) => $.sweep.results.noResults)}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>{t(($) => $.sweep.results.title)}</CardTitle>
            <CardDescription>
              {t(($) => $.sweep.results.description, {
                count: completedResults.length,
              })}
            </CardDescription>
          </div>
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="size-4" />
            {t(($) => $.sweep.results.export)}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium">
                    {sweepData.parameter_name}
                  </th>
                  <th className="py-2 px-4 text-right font-medium">
                    {t(($) => $.sweep.results.rejectionProb)}
                  </th>
                  <th className="py-2 px-4 text-right font-medium">
                    {t(($) => $.sweep.results.utilization)}
                  </th>
                  <th className="py-2 px-4 text-right font-medium">
                    {t(($) => $.sweep.results.throughput)}
                  </th>
                  <th className="py-2 px-4 text-right font-medium">
                    {t(($) => $.sweep.results.actions)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedResults.map((result) => (
                  <tr key={result.report_id} className="border-b last:border-0">
                    <td className="py-3 px-4 font-medium">
                      {String(result.parameter_value)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1">
                        <TrendingDown className="size-3 text-red-600" />
                        {(result.metrics!.rejection_probability * 100).toFixed(
                          2,
                        )}
                        %
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(result.metrics!.avg_channel_utilization * 100).toFixed(
                        2,
                      )}
                      %
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="size-3 text-green-600" />
                        {result.metrics!.throughput.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/simulations/$simulationId/reports/$reportId"
                        params={{
                          simulationId: sweepData.configuration_id,
                          reportId: result.report_id,
                        }}
                      >
                        <Button variant="ghost" size="sm">
                          {t(($) => $.sweep.results.view)}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
