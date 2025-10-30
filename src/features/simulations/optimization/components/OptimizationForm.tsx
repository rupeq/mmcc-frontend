import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Info, Loader2 } from "lucide-react";
import { FormProvider as Form, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Separator,
} from "@/components/ui";
import { OptimizationDistributionSelector } from "@/features/simulations/optimization/components/OptimizationDistributionSelector";
import {
  type OptimizationRequestInput,
  optimizationRequestSchema,
} from "@/features/simulations/optimization/schemas";
import {
  type OptimizationResult,
  useOptimizeChannelsMutation,
} from "@/features/simulations/optimization/services";

interface OptimizationFormProps {
  onSuccess: (result: OptimizationResult) => void;
}

// Algorithm Info Card Component
const AlgorithmInfoCard = ({ type }: { type: string }) => {
  const { t } = useTranslation(["optimization"]);

  if (type === "gradient_descent") {
    return (
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <Info className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-900 dark:text-blue-100">
          {t(($) => $.form.algorithms.gradient_descent.infoTitle)}
        </AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          {t(($) => $.form.algorithms.gradient_descent.info)}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

// Binary Search Fields
const BinarySearchFields = ({
  form,
  isSubmitting,
}: {
  form: any;
  isSubmitting: boolean;
}) => {
  const { t } = useTranslation(["optimization"]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="targetRejectionProb"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(($) => $.form.fields.targetRejectionProb.label)}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.05"
                {...field}
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
                disabled={isSubmitting}
              />
            </FormControl>
            <FormDescription>
              {t(($) => $.form.fields.targetRejectionProb.description)}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="maxChannels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(($) => $.form.fields.maxChannels.label)}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="100"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? parseInt(val, 10) : undefined);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.form.fields.maxChannels.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tolerance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(($) => $.form.fields.tolerance.label)}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.01"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? parseFloat(val) : undefined);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.form.fields.tolerance.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Cost Minimization Fields
const CostMinimizationFields = ({
  form,
  isSubmitting,
}: {
  form: any;
  isSubmitting: boolean;
}) => {
  const { t } = useTranslation(["optimization"]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="channelCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(($) => $.form.fields.channelCost.label)}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.form.fields.channelCost.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rejectionPenalty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.form.fields.rejectionPenalty.label)}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="500.0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.form.fields.rejectionPenalty.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="maxChannels"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(($) => $.form.fields.maxChannels.label)}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="50"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val ? parseInt(val, 10) : undefined);
                }}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormDescription>
              {t(($) => $.form.fields.maxChannels.description)}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// Gradient Descent Fields
const GradientDescentFields = ({
  form,
  isSubmitting,
}: {
  form: any;
  isSubmitting: boolean;
}) => {
  const { t } = useTranslation(["optimization"]);

  return (
    <div className="space-y-6">
      <AlgorithmInfoCard type="gradient_descent" />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="channelCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.form.fields.channelCost.label)} (
                {t(($) => $.form.optional)})
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10.0"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? parseFloat(val) : undefined);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.form.fields.channelCost.descriptionOptional)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rejectionPenalty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.form.fields.rejectionPenalty.label)} (
                {t(($) => $.form.optional)})
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.0"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? parseFloat(val) : undefined);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.form.fields.rejectionPenalty.descriptionOptional)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Multi-Objective Fields
const MultiObjectiveFields = ({
  form,
  isSubmitting,
}: {
  form: any;
  isSubmitting: boolean;
}) => {
  const { t } = useTranslation(["optimization"]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-4">
          {t(($) => $.form.fields.weights.title)}
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="rejectionWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(($) => $.form.fields.rejectionWeight.label)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.5"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="utilizationWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(($) => $.form.fields.utilizationWeight.label)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.3"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="costWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(($) => $.form.fields.costWeight.label)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.2"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          {t(($) => $.form.fields.weights.description)}
        </p>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-4">
          {t(($) => $.form.fields.costs.title)}
        </h4>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="channelCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(($) => $.form.fields.channelCost.label)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="10.0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rejectionPenalty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(($) => $.form.fields.rejectionPenalty.label)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="100.0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export const OptimizationForm = ({ onSuccess }: OptimizationFormProps) => {
  const { t } = useTranslation(["optimization"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OptimizationRequestInput>({
    resolver: zodResolver(optimizationRequestSchema),
    defaultValues: {
      base_request: {
        numChannels: 1,
        simulationTime: 100,
        numReplications: 10,
        arrivalProcess: { distribution: "exponential", rate: 5 },
        serviceProcess: { distribution: "exponential", rate: 10 },
        collectGanttData: false,
        collectServiceTimes: false,
        collectTemporalProfile: false,
      },
      optimizationType: "binary_search",
      targetRejectionProb: 0.05,
      maxChannels: 100,
      tolerance: 0.01,
    },
  });

  const optimizeMutation = useOptimizeChannelsMutation({
    onSuccess: (data) => {
      setIsSubmitting(false);
      onSuccess(data);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const selectedOptimizationType = form.watch("optimizationType");

  const handleSubmit = async (values: OptimizationRequestInput) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const parsedValues = optimizationRequestSchema.parse(values);
      await optimizeMutation.mutateAsync(parsedValues);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const renderAlgorithmFields = () => {
    const type = selectedOptimizationType;

    switch (type) {
      case "binary_search":
        return <BinarySearchFields form={form} isSubmitting={isSubmitting} />;
      case "cost_minimization":
        return (
          <CostMinimizationFields form={form} isSubmitting={isSubmitting} />
        );
      case "gradient_descent":
        return (
          <GradientDescentFields form={form} isSubmitting={isSubmitting} />
        );
      case "multi_objective":
        return <MultiObjectiveFields form={form} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t(($) => $.form.algorithm.title)}</CardTitle>
              <CardDescription>
                {t(($) => $.form.algorithm.description)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="optimizationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(($) => $.form.algorithm.label)}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl className="h-15! w-full text-left">
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(($) => $.form.algorithm.placeholder)}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="binary_search">
                          <div className="flex flex-col gap-1 py-2">
                            <span className="font-semibold text-base">
                              {t(($) => $.form.algorithms.binary_search.name)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {t(
                                ($) =>
                                  $.form.algorithms.binary_search.description,
                              )}
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cost_minimization">
                          <div className="flex flex-col gap-1 py-2">
                            <span className="font-semibold text-base">
                              {t(
                                ($) => $.form.algorithms.cost_minimization.name,
                              )}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {t(
                                ($) =>
                                  $.form.algorithms.cost_minimization
                                    .description,
                              )}
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gradient_descent">
                          <div className="flex flex-col gap-1 py-2">
                            <span className="font-semibold text-base">
                              {t(
                                ($) => $.form.algorithms.gradient_descent.name,
                              )}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {t(
                                ($) =>
                                  $.form.algorithms.gradient_descent
                                    .description,
                              )}
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="multi_objective">
                          <div className="flex flex-col gap-1 py-2">
                            <span className="font-semibold text-base">
                              {t(($) => $.form.algorithms.multi_objective.name)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {t(
                                ($) =>
                                  $.form.algorithms.multi_objective.description,
                              )}
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedOptimizationType && (
                <>
                  <Separator />
                  {renderAlgorithmFields()}
                </>
              )}
            </CardContent>
          </Card>

          {/* Simulation Parameters Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t(($) => $.form.baseRequest.title)}</CardTitle>
              <CardDescription>
                {t(($) => $.form.baseRequest.description)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="base_request.simulationTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(($) => $.form.baseRequest.simulationTime)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="base_request.numReplications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(($) => $.form.baseRequest.numReplications)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 1)
                          }
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Distributions Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t(($) => $.form.distributions.title)}</CardTitle>
              <CardDescription>
                {t(($) => $.form.distributions.description)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-4">
                  {t(($) => $.form.distributions.arrival)}
                </h4>
                <OptimizationDistributionSelector
                  form={form}
                  fieldPrefix="arrivalProcess"
                  label={t(($) => $.form.distributions.arrival)}
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-4">
                  {t(($) => $.form.distributions.service)}
                </h4>
                <OptimizationDistributionSelector
                  form={form}
                  fieldPrefix="serviceProcess"
                  label={t(($) => $.form.distributions.service)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button & Error Display */}
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="w-full"
              size="lg"
            >
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isSubmitting
                ? t(($) => $.form.buttons.optimizing)
                : t(($) => $.form.buttons.optimize)}
            </Button>

            {optimizeMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>{t(($) => $.form.errors.title)}</AlertTitle>
                <AlertDescription>
                  {optimizeMutation.error?.message ||
                    t(($) => $.form.errors.general)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
