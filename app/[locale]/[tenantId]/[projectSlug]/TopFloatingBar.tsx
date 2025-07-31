"use client";
import React from "react";
import Image from "next/image";
import OpsIconButton from "@components/OpsIconButton";
import { Box, Stack } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Compass from "./Compass";

const TopFloatingBar = ({ angleDeg }: { angleDeg: number }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        left: 0,
        width: "100%",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <Box sx={{ userSelect: "none", pointerEvents: "auto" }}>
        <Image
          src="/logo-big.svg"
          alt="Logo"
          width={100}
          height={50}
          priority
        />
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <OpsIconButton size="large" sx={{ borderRadius: "50%" }}>
          <LightModeIcon />
        </OpsIconButton>
        <OpsIconButton size="large" sx={{ borderRadius: "50%" }}>
          <VisibilityIcon />
        </OpsIconButton>
        <Compass angleDeg={angleDeg} />
      </Stack>
    </Box>
  );
};

export default TopFloatingBar;
