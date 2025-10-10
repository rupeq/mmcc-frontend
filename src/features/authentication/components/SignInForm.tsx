import { type ComponentProps, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { FormProvider as Form, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { PasswordInput } from "@/components/PasswordInput";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { zSignInRequestSchema } from "@/lib/api";
import { cn } from "@/lib/styles/utils";

interface Props extends ComponentProps<"div"> {
  onFormSubmit: (data: z.infer<typeof zSignInRequestSchema>) => void;
  isLoading?: boolean;
  error?: AxiosError<{ detail: string }> | null;
}

export const SignInForm = ({
  onFormSubmit,
  isLoading = false,
  className,
  error,
  ...props
}: Props) => {
  const { t } = useTranslation(["authentication"]);

  const form = useForm<z.input<typeof zSignInRequestSchema>>({
    resolver: zodResolver(zSignInRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!error) {
      return;
    }

    const errorMessage =
      error.response?.data?.detail ?? "Authentication failed";

    form.setError("root", {
      type: "manual",
      message: errorMessage,
    });
  }, [error, form]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t(($) => $.form.title)}</CardTitle>
          <CardDescription>{t(($) => $.form.description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
              <FieldGroup className="gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(($) => $.form.fields.email)}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="a@example.com"
                          autoComplete="username"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(($) => $.form.fields.password)}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          required={true}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.formState.errors.root && (
                  <div className="text-sm text-red-500">
                    {form.formState.errors.root.message}
                  </div>
                )}
                <Button type="submit" isLoading={isLoading}>
                  {t(($) => $.form.buttons.submit)}
                </Button>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
