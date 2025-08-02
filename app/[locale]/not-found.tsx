import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
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
      <Typography variant="h2" color="primary" gutterBottom>
        404
      </Typography>

      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>

      <Typography variant="body1" color="text.secondary" textAlign="center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>

      <Button
        component={Link}
        href="/"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Go Home
      </Button>
    </Box>
  );
}
