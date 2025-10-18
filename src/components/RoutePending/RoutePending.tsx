import { useTranslation } from "react-i18next";

import { Card, CardContent, Spinner } from "@/components/ui";

export const RoutePending = () => {
  const { t } = useTranslation(["common"]);

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <Spinner size="lg" />
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">
              {t(($) => $.loading.default)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(($) => $.loading.pleaseWait)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
