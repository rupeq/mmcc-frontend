import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  FormProvider as Form,
  useForm,
  type UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  Button,
  Checkbox,
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
  Separator,
} from "@/components/ui";
import {
  type CreateSimulationFormData,
  createSimulationSchema,
} from "@/features/simulations/schemas";
import {
  getSimulationsQueryKeys,
  useCreateSimulationMutation,
} from "@/features/simulations/services";
import { queryClient } from "@/lib/tanstack";

import { DistributionSelector } from "./DistributionSelector";

interface CreateSimulationStepProps {
  step: number;
  form: UseFormReturn<CreateSimulationFormData>;
}

const CreateSimulationStep = ({ step, form }: CreateSimulationStepProps) => {
  const { t } = useTranslation(["simulations"]);

  if (step === 0) {
    return (
      <div className="space-y-4" key={step}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(($) => $.createForm.fields.name.label)}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t(($) => $.createForm.fields.name.placeholder)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.createForm.fields.description.label)}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={t(
                    ($) => $.createForm.fields.description.placeholder,
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4" key={step}>
        <FormField
          control={form.control}
          name="simulationParameters.numChannels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.createForm.fields.numChannels.label)}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseInt(value, 10) : 0);
                  }}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.createForm.fields.numChannels.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="simulationParameters.simulationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.createForm.fields.simulationTime.label)}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.1"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) : 0);
                  }}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.createForm.fields.simulationTime.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="simulationParameters.numReplications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.createForm.fields.numReplications.label)}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseInt(value, 10) : 1);
                  }}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.createForm.fields.numReplications.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6" key={step}>
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t(($) => $.distributions.arrivalProcess.title)}
          </h3>
          <DistributionSelector
            form={form}
            fieldPrefix="arrivalProcess"
            label={t(($) => $.distributions.arrivalProcess.label)}
          />
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t(($) => $.distributions.serviceProcess.title)}
          </h3>
          <DistributionSelector
            form={form}
            fieldPrefix="serviceProcess"
            label={t(($) => $.distributions.serviceProcess.label)}
          />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4" key={step}>
        <FormField
          control={form.control}
          name="simulationParameters.randomSeed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(($) => $.createForm.fields.randomSeed.label)}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? undefined}
                  type="number"
                  placeholder={t(
                    ($) => $.createForm.fields.randomSeed.placeholder,
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseInt(value, 10) : null);
                  }}
                />
              </FormControl>
              <FormDescription>
                {t(($) => $.createForm.fields.randomSeed.description)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="simulationParameters.collectGanttData"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  onCheckedChange={field.onChange}
                  checked={field.value}
                  ref={field.ref}
                />
              </FormControl>
              <FormLabel className="!mt-0">
                {t(($) => $.createForm.fields.collectGanttData)}
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="simulationParameters.collectServiceTimes"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  onCheckedChange={field.onChange}
                  checked={field.value}
                  ref={field.ref}
                />
              </FormControl>
              <FormLabel className="!mt-0">
                {t(($) => $.createForm.fields.collectServiceTimes)}
              </FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="simulationParameters.collectTemporalProfile"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  onCheckedChange={field.onChange}
                  checked={field.value}
                  ref={field.ref}
                />
              </FormControl>
              <FormLabel className="!mt-0">
                {t(($) => $.createForm.fields.collectTemporalProfile)}
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    );
  }

  return null;
};

export const CreateSimulationForm = () => {
  const { t } = useTranslation(["simulations"]);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const form = useForm<CreateSimulationFormData>({
    resolver: zodResolver(createSimulationSchema),
    defaultValues: {
      name: "",
      description: "",
      simulationParameters: {
        numChannels: 3,
        simulationTime: 1000,
        numReplications: 1,
        arrivalProcess: { distribution: "exponential", rate: 5 },
        serviceProcess: { distribution: "exponential", rate: 10 },
        randomSeed: null,
        maxGanttItems: 10000,
        maxServiceTimeSamples: 1000,
        collectGanttData: true,
        collectServiceTimes: true,
        collectTemporalProfile: false,
        temporalWindowSize: 10,
        temporalSnapshotInterval: 1,
      },
    },
  });

  const steps = [
    "basicInfo",
    "systemConfig",
    "distributions",
    "advancedOptions",
  ] as const;

  const getStepTitle = () => {
    return t(($) => $.createForm.steps[steps[currentStep]]);
  };

  const createMutation = useCreateSimulationMutation({
    onSuccess: ({ simulation_configuration_id }) => {
      queryClient.invalidateQueries({
        queryKey: getSimulationsQueryKeys(),
      });
      navigate({
        to: "/simulations/$simulationId",
        params: { simulationId: simulation_configuration_id },
      });
    },
  });

  const handleSubmit = (values: CreateSimulationFormData) => {
    const parsedValues = createSimulationSchema.parse(values);
    createMutation.mutate(parsedValues);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t(($) => $.createForm.title)}</DialogTitle>
        <DialogDescription>
          {t(($) => $.createForm.stepLabel, {
            current: currentStep + 1,
            total: 4,
            title: getStepTitle(),
          })}
        </DialogDescription>
      </DialogHeader>
      <div>
        <Form {...form}>
          <form
            id="CreateSimulationForm"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CreateSimulationStep step={currentStep} form={form} />
          </form>
        </Form>
      </div>
      <DialogFooter className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          {t(($) => $.createForm.buttons.previous)}
        </Button>
        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {t(($) => $.createForm.buttons.next)}
          </Button>
        ) : (
          <Button
            key="submit"
            type="submit"
            form="CreateSimulationForm"
            isLoading={createMutation.isPending}
          >
            {t(($) => $.createForm.buttons.create)}
          </Button>
        )}
      </DialogFooter>
    </>
  );
};
