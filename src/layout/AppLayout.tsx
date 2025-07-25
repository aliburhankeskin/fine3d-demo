"use client";

import React from "react";
import { Box, Stack } from "@mui/material";
import FixedRightSideMenu from "./FixedRightSideMenu";

interface AppLayoutProps {
  drawer: React.ReactNode;
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ drawer, children }) => {
  return (
    <Stack
      direction="row"
      sx={{ height: "100dvh", width: "100%", overflow: "hidden" }}
    >
      <Box sx={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </Box>

      <Box
        sx={{
          width: 320,
          maxWidth: "100%",
          bgcolor: "#fff",
          borderLeft: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        {drawer}
      </Box>

      <FixedRightSideMenu />
    </Stack>
  );
};

export default AppLayout;
