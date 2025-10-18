import { Activity, Copy, RotateCcw } from "lucide-react";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { zSimulationRequestOutput } from "@/lib/api";

interface Props {
  parameters: z.infer<typeof zSimulationRequestOutput>;
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <div className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
    <div className="rounded-md bg-muted/40 p-2">
      <Icon className="size-5 text-primary" />
    </div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold leading-none">{value}</p>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  </div>
);

export const SimulationParameters = ({ parameters }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>System Configuration</CardTitle>
      <CardDescription>
        Core parameters for the queueing system simulation
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={Copy}
          label="Service Channels"
          value={parameters.numChannels}
        />
        <MetricCard
          icon={Activity}
          label="Simulation Time"
          value={parameters.simulationTime.toLocaleString()}
          unit="time units"
        />
        <MetricCard
          icon={RotateCcw}
          label="Replications"
          value={parameters.numReplications}
        />
      </div>
      {parameters.randomSeed !== null &&
        parameters.randomSeed !== undefined && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
              <span className="text-sm font-medium text-muted-foreground">
                Random Seed
              </span>
              <code className="rounded bg-background px-2 py-1 text-sm font-mono">
                {parameters.randomSeed}
              </code>
            </div>
          </div>
        )}
    </CardContent>
  </Card>
);
