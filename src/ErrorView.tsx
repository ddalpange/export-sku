import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Typography } from "@mui/material";

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div role="alert">
      <Typography variant="h5">Something went wrong:</Typography>
      <Typography variant="caption">
        <pre>{error.message}</pre>
      </Typography>
    </div>
  );
};

interface ErrorViewProps {
  children: React.ReactNode;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};
