import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { FormProvider as Form, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useStartSweepMutation } from "@/features/simulations/services/sweep";
import { type zGetSimulationConfigurationResponse } from "@/lib/api";

const sweepParameterSchema = z.object({
  parameterName: z.string().min(1, "Parameter is required"),
  values: z.array(z.number()).min(2, "At least 2 values required"),
});

type SweepFormData = z.infer<typeof sweepParameterSchema>;

interface Props {
  simulation: z.infer<typeof zGetSimulationConfigurationResponse>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SWEEPABLE_PARAMETERS = [
  {
    value: "num_channels",
    label: "Number of Channels",
    type: "integer",
    category: "System",
  },
  {
    value: "simulation_time",
    label: "Simulation Time",
    type: "number",
    category: "System",
  },
  {
    value: "num_replications",
    label: "Number of Replications",
    type: "integer",
    category: "System",
  },
  {
    value: "arrival_process.rate",
    label: "Arrival Rate (λ)",
    type: "number",
    category: "Arrival Process",
  },
  {
    value: "service_process.rate",
    label: "Service Rate (μ)",
    type: "number",
    category: "Service Process",
  },
] as const;

export const SweepConfigurationDialog = ({
  simulation,
  open,
  onOpenChange,
}: Props) => {
  const { t } = useTranslation(["simulations"]);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const form = useForm<SweepFormData>({
    resolver: zodResolver(sweepParameterSchema),
    defaultValues: {
      parameterName: "",
      values: [],
    },
  });

  const startSweepMutation = useStartSweepMutation({
    onSuccess: (response) => {
      onOpenChange(false);
      navigate({
        to: "/simulations/$simulationId/sweeps/$batchId",
        params: {
          simulationId: simulation.id,
          batchId: response.batch_id,
        },
      });
    },
  });

  const selectedParam = form.watch("parameterName");
  const currentValues = form.watch("values");

  const getParamType = (paramName: string): "integer" | "number" => {
    const param = SWEEPABLE_PARAMETERS.find((p) => p.value === paramName);
    return param?.type || "number";
  };

  const validateValue = (
    value: string,
    type: "integer" | "number",
  ): number | null => {
    if (!value.trim()) return null;

    const num = type === "integer" ? parseInt(value, 10) : parseFloat(value);

    if (isNaN(num)) {
      setValidationError(
        t(($) => $.sweep.configure.errors.invalidNumber, { type }),
      );
      return null;
    }

    if (num <= 0) {
      setValidationError(t(($) => $.sweep.configure.errors.mustBePositive));
      return null;
    }

    if (currentValues.includes(num)) {
      setValidationError(t(($) => $.sweep.configure.errors.duplicateValue));
      return null;
    }

    setValidationError(null);
    return num;
  };

  const handleAddValue = () => {
    if (!selectedParam) {
      setValidationError(t(($) => $.sweep.configure.errors.selectParameter));
      return;
    }

    const type = getParamType(selectedParam);
    const num = validateValue(inputValue, type);

    if (num !== null) {
      const newValues = [...currentValues, num].sort((a, b) => a - b);
      form.setValue("values", newValues);
      setInputValue("");
      setValidationError(null);
    }
  };

  const handleRemoveValue = (index: number) => {
    const newValues = currentValues.filter((_, i) => i !== index);
    form.setValue("values", newValues);
    setValidationError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const validateSweep = (): string | null => {
    if (currentValues.length < 2) {
      return t(($) => $.sweep.configure.errors.minValues);
    }

    if (currentValues.length > 50) {
      return t(($) => $.sweep.configure.errors.maxValues);
    }

    const totalRuns =
      currentValues.length * simulation.simulation_parameters.numReplications;

    if (totalRuns > 1000) {
      return t(($) => $.sweep.configure.errors.tooManyRuns, {
        total: totalRuns,
        max: 1000,
      });
    }

    return null;
  };

  const preview =
    selectedParam && currentValues.length > 0 && !validateSweep()
      ? {
          count: currentValues.length,
          replications: simulation.simulation_parameters.numReplications,
          totalRuns:
            currentValues.length *
            simulation.simulation_parameters.numReplications,
          estimatedTime: Math.ceil(
            currentValues.length *
              simulation.simulation_parameters.numReplications *
              0.1,
          ),
        }
      : null;

  const handleSubmit = (data: SweepFormData) => {
    const sweepError = validateSweep();
    if (sweepError) {
      form.setError("values", { message: sweepError });
      return;
    }

    startSweepMutation.mutate({
      simulationConfigurationId: simulation.id,
      sweepParameter: {
        name: data.parameterName,
        values: data.values,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(($) => $.sweep.configure.title)}</DialogTitle>
          <DialogDescription>
            {t(($) => $.sweep.configure.description)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="parameterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(($) => $.sweep.configure.parameter)}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("values", []);
                      setInputValue("");
                      setValidationError(null);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            ($) => $.sweep.configure.selectParameter,
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SWEEPABLE_PARAMETERS.map((param) => (
                        <SelectItem
                          key={param.value}
                          value={param.value}
                          className="cursor-pointer"
                        >
                          {param.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="values"
              render={() => (
                <FormItem>
                  <FormLabel>{t(($) => $.sweep.configure.values)}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        step={
                          getParamType(selectedParam) === "integer"
                            ? "1"
                            : "0.01"
                        }
                        placeholder={t(
                          ($) => $.sweep.configure.valuesPlaceholder,
                        )}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setValidationError(null);
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={!selectedParam}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddValue}
                      disabled={!selectedParam || !inputValue.trim()}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  {validationError && (
                    <p className="text-sm text-red-500">{validationError}</p>
                  )}

                  {currentValues.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentValues.map((value, index) => (
                        <div
                          key={`${value}-${index}`}
                          className="flex items-center gap-1 rounded-md border bg-muted px-2 py-1"
                        >
                          <span className="text-sm font-medium">{value}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveValue(index)}
                            className="ml-1 rounded-sm hover:bg-muted-foreground/20"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <FormDescription className="mt-1">
                    {t(($) => $.sweep.configure.valuesDescription)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {preview && (
              <div className="rounded-md border bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium">
                  {t(($) => $.sweep.configure.preview)}
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    ✓{" "}
                    {t(($) => $.sweep.configure.previewSimulations, {
                      count: preview.count,
                    })}
                  </p>
                  <p>
                    ✓{" "}
                    {t(($) => $.sweep.configure.previewReplications, {
                      count: preview.replications,
                    })}
                  </p>
                  <p>
                    ✓{" "}
                    {t(($) => $.sweep.configure.previewTotal, {
                      count: preview.totalRuns,
                    })}
                  </p>
                  <p>
                    ⏱{" "}
                    {t(($) => $.sweep.configure.previewTime, {
                      minutes: preview.estimatedTime,
                    })}
                  </p>
                </div>
              </div>
            )}

            {(() => {
              const sweepError = validateSweep();
              return sweepError && currentValues.length >= 2 ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
                  <p className="text-sm text-red-900 dark:text-red-100">
                    {sweepError}
                  </p>
                </div>
              ) : null;
            })()}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t(($) => $.sweep.configure.cancel)}
              </Button>
              <Button
                type="submit"
                isLoading={startSweepMutation.isPending}
                disabled={!preview || !!validateSweep()}
              >
                {t(($) => $.sweep.configure.start)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
