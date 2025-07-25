"use client";
import React, { useState } from "react";
import { Box, ButtonBase } from "@mui/material";

const stages = ["Etap Görünümü", "1. Etap", "2. Etap"];

const BottomFloatingBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabWidth = 125;
  const horizontalPadding = 12;
  const verticalPadding = 6;

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        bgcolor: "rgba(249, 250, 252, 0.5)",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        zIndex: 10,
        px: `${horizontalPadding}px`,
        py: `${verticalPadding}px`,
        width: tabWidth * stages.length + horizontalPadding * 2,
        height: "auto",
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: `${verticalPadding}px`,
          left: `${horizontalPadding}px`,
          width: tabWidth,
          height: `calc(100% - ${verticalPadding * 2}px)`,
          bgcolor: "#2F3D5E",
          borderRadius: 999,
          transform: `translateX(${activeIndex * tabWidth}px)`,
          transition: "transform 300ms ease",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />

      {stages.map((stage, index) => (
        <ButtonBase
          key={stage}
          onClick={() => setActiveIndex(index)}
          disableRipple
          disableTouchRipple
          sx={{
            width: tabWidth,
            height: `calc(100% - ${verticalPadding * 2}px)`,
            borderRadius: 999,
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 500,
            textTransform: "none",
            color: activeIndex === index ? "#fff" : "#333",
            "&:hover": { bgcolor: "transparent" },
            "&:active": { bgcolor: "transparent" },
            minHeight: "36px",
          }}
        >
          {stage}
        </ButtonBase>
      ))}
    </Box>
  );
};

export default BottomFloatingBar;
