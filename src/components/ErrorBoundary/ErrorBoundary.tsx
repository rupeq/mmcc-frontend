import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

interface ErrorBoundaryProps {
  error: Error;
  reset?: () => void;
}

export const ErrorBoundary = ({ error, reset }: ErrorBoundaryProps) => {
  const { t } = useTranslation(["common"]);
  const router = useRouter();
  const navigate = useNavigate();

  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      router.invalidate();
    }
  };

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t(($) => $.errors.title)}</CardTitle>
          <CardDescription>{t(($) => $.errors.description)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm font-mono text-destructive">
              {error.message}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            {t(($) => $.errors.tryAgain)}
          </Button>
          <Button onClick={handleGoHome} className="flex-1">
            {t(($) => $.errors.goHome)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
