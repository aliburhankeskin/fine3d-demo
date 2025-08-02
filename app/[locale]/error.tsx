"use client";

import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";

// ✅ App Router error.tsx - Automatic error handling
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ✅ Log the error to an error reporting service
    console.error("Page Error:", error);
  }, [error]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      gap={2}
      p={3}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong!
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center">
        We encountered an unexpected error. Please try again.
      </Typography>

      {process.env.NODE_ENV === "development" && (
        <Box
          component="pre"
          sx={{
            backgroundColor: "#f5f5f5",
            p: 2,
            borderRadius: 1,
            maxWidth: "100%",
            overflow: "auto",
            fontSize: "0.75rem",
            mt: 2,
          }}
        >
          {error.message}
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={reset}
        sx={{ mt: 2 }}
      >
        Try again
      </Button>
    </Box>
  );
}
