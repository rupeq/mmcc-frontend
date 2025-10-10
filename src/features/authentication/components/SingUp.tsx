import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { useSignUpMutation } from "@/features/authentication/services";
import { type zSignInRequestSchema } from "@/lib/api";

import { SignUpForm } from "./SingUpForm";

export const SignUp = () => {
  const navigate = useNavigate();
  const signUpMutation = useSignUpMutation();

  const handleSubmit = (data: z.infer<typeof zSignInRequestSchema>) => {
    signUpMutation.mutate(data, {
      onSuccess: ({ email }) => {
        navigate({ to: "/signin", search: { email } });
      },
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm
          onFormSubmit={handleSubmit}
          isLoading={signUpMutation.isPending}
          error={signUpMutation.error}
        />
      </div>
    </div>
  );
};
