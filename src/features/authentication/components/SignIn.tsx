import { useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";

import { useSignInMutation } from "@/features/authentication/services";
import { type zSignInRequestSchema } from "@/lib/api";

import { SignInForm } from "./SignInForm";

export const SignIn = () => {
  const defaultEmail = useSearch({
    select: (params) => params.email,
    from: "/signin/",
  });
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();

  const handleSubmit = (data: z.infer<typeof zSignInRequestSchema>) => {
    signInMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: "/" });
      },
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm
          defaultEmail={defaultEmail}
          onFormSubmit={handleSubmit}
          isLoading={signInMutation.isPending}
          error={signInMutation.error}
        />
      </div>
    </div>
  );
};
