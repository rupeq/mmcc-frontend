import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  base64Image?: string;
  altText: string;
  isLoading: boolean;
  error?: Error | null;
}

export const ChartDisplay = ({
  base64Image,
  altText,
  isLoading,
  error,
}: Props) => {
  const { t } = useTranslation(["reports"]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <AlertTriangle className="size-8 mb-2" />
        <p>{t(($) => $.charts.errors.loadFailed)}</p>
        <p className="text-xs">{error.message}</p>
      </div>
    );
  }

  if (!base64Image) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <AlertTriangle className="size-8 mb-2" />
        <p>{t(($) => $.charts.errors.noData)}</p>
      </div>
    );
  }

  return (
    <img
      src={`data:image/png;base64,${base64Image}`}
      alt={altText}
      className="block w-full h-auto rounded-md"
    />
  );
};
