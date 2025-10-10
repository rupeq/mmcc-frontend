import { createFileRoute } from "@tanstack/react-router";

import { SignIn, signInSearchSchema } from "@/features/authentication";

const RouteComponent = () => <SignIn />;

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
  validateSearch: signInSearchSchema,
});
