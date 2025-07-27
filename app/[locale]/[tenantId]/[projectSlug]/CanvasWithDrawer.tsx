"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { ITagItem } from "@/types/ITagItem";
import OriginalCanvas from "./Canvas";

const MIN_DRAWER_HEIGHT = 100;

export default function CanvasWithDrawer({
  workspaceItems,
  config,
  tabBarData,
}: {
  workspaceItems?: ITagItem[];
  config?: any;
  tabBarData?: any;
}) {
  const totalHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const MAX_DRAWER_HEIGHT = totalHeight - 100;

  const [drawerHeight, setDrawerHeight] = useState(MIN_DRAWER_HEIGHT);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(drawerHeight);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = drawerHeight;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!dragging) return;

    const rawDelta = startY.current - e.touches[0].clientY;
    const nextHeight = Math.max(
      MIN_DRAWER_HEIGHT,
      Math.min(MAX_DRAWER_HEIGHT, startHeight.current + rawDelta)
    );

    setDrawerHeight(nextHeight);
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    } else {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging]);

  const canvasHeight = totalHeight - drawerHeight + 50;

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.height = `${totalHeight - drawerHeight + 30}px`;
    }
  }, [drawerHeight]);
  return (
    <Box
      sx={{
        position: "relative",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <OriginalCanvas
        workspaceItems={workspaceItems}
        config={config}
        tabBarData={tabBarData}
        canvasHeight={canvasHeight}
      />

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${drawerHeight}px`,
          bgcolor: "#fff",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          boxShadow: "0px -2px 10px rgba(0,0,0,0.15)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          transition: dragging ? "none" : "height 0.2s ease",
        }}
      >
        {/* Drag Handle */}
        <Box
          onTouchStart={handleTouchStart}
          sx={{
            height: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "grab",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              bgcolor: "#ccc",
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            pb: 2,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ height: 600, backgroundColor: "#f5f5f5" }}>
            Drawer içeriği buraya gelir...
          </div>
        </Box>
      </Box>
    </Box>
  );
}
