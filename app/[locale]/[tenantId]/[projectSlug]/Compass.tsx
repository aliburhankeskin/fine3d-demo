/* eslint-disable @next/next/no-img-element */
"use client";
import OpsIconButton from "@components/OpsIconButton";
import { Box, Typography } from "@mui/material";

export default function Compass({ angleDeg = 0 }: { angleDeg: number }) {
  return (
    <OpsIconButton
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          transform: `rotate(${angleDeg}deg)`,
          transition: "transform 0.3s ease",
        }}
      >
        <img
          src="/compass.png"
          alt="Compass"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            top: 0,
            left: 0,
          }}
        />

        <Typography
          sx={{
            position: "absolute",
            top: 4,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 15,
            fontWeight: "bold",
            color: "black",
          }}
        >
          K
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 15,
            fontWeight: "bold",
            color: "black",
          }}
        >
          G
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: 4,
            transform: "translateY(-50%)",
            fontSize: 15,
            fontWeight: "bold",
            color: "black",
          }}
        >
          B
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            right: 4,
            transform: "translateY(-50%)",
            fontSize: 15,
            fontWeight: "bold",
            color: "black",
          }}
        >
          D
        </Typography>
      </Box>
    </OpsIconButton>
  );
}
