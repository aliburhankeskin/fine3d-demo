"use client";
import React from "react";
import OpsIconButton from "@components/OpsIconButton";
import { Box } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

interface BottomFloatingControlsProps {
  onLeftClick?: () => void;
  onRightClick?: () => void;
}

const BottomFloatingControls: React.FC<BottomFloatingControlsProps> = ({
  onLeftClick,
  onRightClick,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 30,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        px: 2,
        zIndex: 9,
        pointerEvents: "none",
      }}
    >
      <OpsIconButton
        size="large"
        onClick={onLeftClick}
        sx={{
          borderRadius: "50%",
          pointerEvents: "auto",
        }}
      >
        <ArrowBackIosNewRoundedIcon />
      </OpsIconButton>

      <OpsIconButton
        size="large"
        onClick={onRightClick}
        sx={{
          borderRadius: "50%",
          pointerEvents: "auto",
        }}
      >
        <ArrowForwardIosRoundedIcon />
      </OpsIconButton>
    </Box>
  );
};

export default BottomFloatingControls;
