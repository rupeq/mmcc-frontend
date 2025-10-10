import * as React from "react";

import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { FormFieldContext, FormItemContext } from "@/contexts";
import { useFormField } from "@/hooks";
import { cn } from "@/lib/styles/utils";

import { Label } from "./Label";

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export const FormItem = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={cn("grid gap-2", className)}
        data-slot="form-item"
        {...props}
      />
    </FormItemContext.Provider>
  );
};

export const FormLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn("data-[error=true]:text-red-500", className)}
      data-error={!!error}
      data-slot="form-label"
      htmlFor={formItemId}
      {...props}
    />
  );
};

export const FormControl = ({
  ...props
}: React.ComponentProps<typeof Slot>) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      aria-invalid={!!error}
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : `${formDescriptionId}`
      }
      {...props}
    />
  );
};

export const FormDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="form-description"
      id={formDescriptionId}
      {...props}
    />
  );
};

export const FormMessage = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      className={cn("text-sm text-red-500", className)}
      data-slot="form-message"
      id={formMessageId}
      {...props}
    >
      {body}
    </p>
  );
};
