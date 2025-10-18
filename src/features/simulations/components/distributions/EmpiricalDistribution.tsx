import { useState } from "react";

import { type UseFormReturn } from "react-hook-form";

import {
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
import type { CreateSimulationFormData } from "@/features/simulations/schemas";

interface EmpiricalDistributionProps {
  form: UseFormReturn<CreateSimulationFormData>;
  fieldPrefix: "arrivalProcess" | "serviceProcess";
}

export const EmpiricalDistribution = ({
  form,
  fieldPrefix,
}: EmpiricalDistributionProps) => {
  const [dataInput, setDataInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDataChange = (value: string) => {
    setDataInput(value);
    setError(null);

    if (!value.trim()) {
      form.setValue(`simulationParameters.${fieldPrefix}.data`, []);
      return;
    }

    try {
      const numbers = value
        .split(/[\s,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const num = parseFloat(s);
          if (isNaN(num)) {
            throw new Error(`Invalid number: ${s}`);
          }
          return num;
        });

      if (numbers.length < 2) {
        setError("At least 2 data points required");
        return;
      }

      if (numbers.length > 100000) {
        setError("Maximum 100,000 data points allowed");
        return;
      }

      form.setValue(`simulationParameters.${fieldPrefix}.data`, numbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid data format");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleDataChange(text);
      setDataInput(text);
    };
    reader.readAsText(file);
  };

  const currentData = form.watch(
    `simulationParameters.${fieldPrefix}.data`,
  ) as number[];

  return (
    <>
      <FormField
        control={form.control}
        name={`simulationParameters.${fieldPrefix}.data`}
        render={() => (
          <FormItem>
            <FormLabel>Observed Data</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter values separated by commas, spaces, or newlines&#10;Example: 1.2, 1.5, 2.1, 1.8, 2.3"
                  value={dataInput}
                  onChange={(e) => handleDataChange(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`simulationParameters.${fieldPrefix}-file-upload`}
                    className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Upload from file
                  </label>
                  <input
                    id={`simulationParameters.${fieldPrefix}-file-upload`}
                    type="file"
                    accept=".txt,.csv,.dat"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {currentData && currentData.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {currentData.length} data points loaded
                    </span>
                  )}
                </div>
              </div>
            </FormControl>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <FormDescription>
              Enter observed values (min 2, max 100,000). Supports comma, space,
              or newline separation.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`simulationParameters.${fieldPrefix}.method`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sampling Method</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select sampling method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="inverse_transform">
                  Inverse Transform (ECDF)
                </SelectItem>
                <SelectItem value="kde">Kernel Density Estimation</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Inverse Transform uses empirical CDF, KDE smooths the distribution
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`simulationParameters.${fieldPrefix}.bandwidth`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>KDE Bandwidth (Optional)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="Auto-detected if empty"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? parseFloat(value) : null);
                }}
              />
            </FormControl>
            <FormDescription>
              Leave empty for automatic bandwidth selection (Scott's rule)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
