import { createFileRoute } from "@tanstack/react-router";

import { SignIn } from "@/features/authentication";

const RouteComponent = () => <SignIn />;

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
});
