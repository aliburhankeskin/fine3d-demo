import React from "react";
import { Box } from "@mui/material";
import TopFloatingBar from "./TopFloatingBar";
import BottomFloatingBar from "./BottomFloatingBar";
import BottomFloatingControls from "./BottomFloatingControls";

interface MainContentProps {
  children?: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        p: 0,
      }}
    >
      {children}
      <TopFloatingBar />

      <BottomFloatingControls />

      <BottomFloatingBar />
    </Box>
  );
};

export default MainContent;
