import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  FormProvider as Form,
  useForm,
  type UseFormReturn,
} from "react-hook-form";

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
  if (step === 0) {
    return (
      <div className="space-y-4" key={step}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Simulation Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="System Test" />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Testing loss system performance..."
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
              <FormLabel>Number of Channels</FormLabel>
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
                The number of service channels available
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
              <FormLabel>Simulation Time</FormLabel>
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
                Total simulation time in time units
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
              <FormLabel>Number of Replications</FormLabel>
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
                Run multiple times for statistical accuracy
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
          <h3 className="text-lg font-medium mb-4">Arrival Process</h3>
          <DistributionSelector
            form={form}
            fieldPrefix="arrivalProcess"
            label="Distribution Type"
          />
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium mb-4">Service Process</h3>
          <DistributionSelector
            form={form}
            fieldPrefix="serviceProcess"
            label="Distribution Type"
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
              <FormLabel>Random Seed (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? undefined}
                  type="number"
                  placeholder="Leave empty for random"
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseInt(value, 10) : null);
                  }}
                />
              </FormControl>
              <FormDescription>
                Set a seed for reproducible results
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
              <FormLabel className="!mt-0">Collect Gantt Chart Data</FormLabel>
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
              <FormLabel className="!mt-0">Collect Service Times</FormLabel>
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
              <FormLabel className="!mt-0">Collect Temporal Profile</FormLabel>
            </FormItem>
          )}
        />
      </div>
    );
  }

  return null;
};

export const CreateSimulationForm = () => {
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Basic Information";
      case 1:
        return "System Configuration";
      case 2:
        return "Distributions";
      case 3:
        return "Advanced Options";
      default:
        return "";
    }
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
        <DialogTitle>Create New Simulation</DialogTitle>
        <DialogDescription>
          Step {currentStep + 1} of 4: {getStepTitle()}
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
          Previous
        </Button>
        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            Next
          </Button>
        ) : (
          <Button
            key="submit"
            type="submit"
            form="CreateSimulationForm"
            isLoading={createMutation.isPending}
          >
            Create Simulation
          </Button>
        )}
      </DialogFooter>
    </>
  );
};
