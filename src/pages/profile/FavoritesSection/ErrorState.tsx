import { memo } from "react";
import { AlertMessage, Button } from "../../../components/";

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export const ErrorState = memo(function ErrorState({
  error,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="space-y-4">
      <AlertMessage
        message={
          error instanceof Error
            ? error.message
            : "Failed to load your favorite tools. Please try again."
        }
        isError={true}
        duration={3000}
      />
      <Button onClick={onRetry} variant="secondary">
        Try Again
      </Button>
    </div>
  );
});
