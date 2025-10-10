import { createFileRoute } from "@tanstack/react-router";

import { SignUp } from "@/features/authentication";

const RouteComponent = () => <SignUp />;

export const Route = createFileRoute("/signup/")({
  component: RouteComponent,
});
