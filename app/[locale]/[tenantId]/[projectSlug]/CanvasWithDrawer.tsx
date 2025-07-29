"use client";

import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import OriginalCanvas from "./Canvas";
import EtapDrawerContent from "./EtapDrawerContent";

const MIN_DRAWER_HEIGHT = 100;

export default function CanvasWithDrawer({
  presentationData,
  config,
  tabBarData,
  units,
  initResponse,
}: {
  presentationData?: any;
  config?: any;
  tabBarData?: any;
  units?: any;
  initResponse?: any;
}) {
  const workspaceItems = presentationData?.tags || [];
  const isMobile = useMediaQuery("(max-width: 768px)");
  const totalHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const MAX_DRAWER_HEIGHT = totalHeight - 100;

  const [drawerHeight, setDrawerHeight] = useState(MIN_DRAWER_HEIGHT);

  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(drawerHeight);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // Event bubbling'i durdur
    setDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = drawerHeight;
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging) return;

      e.preventDefault(); // Default davranışı engelle
      const rawDelta = startY.current - e.touches[0].clientY;
      const slowedDelta = rawDelta * 0.8;
      const nextHeight = Math.max(
        MIN_DRAWER_HEIGHT,
        Math.min(MAX_DRAWER_HEIGHT, startHeight.current + slowedDelta)
      );

      setDrawerHeight(nextHeight);
    },
    [dragging, MAX_DRAWER_HEIGHT]
  );

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    } else {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, handleTouchMove, handleTouchEnd]);

  const canvasHeight = totalHeight - drawerHeight + 50;

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.height = `${totalHeight - drawerHeight + 40}px`;
    }
  }, [drawerHeight, totalHeight]);

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
        canvasHeight={isMobile ? canvasHeight : undefined}
      />

      {isMobile && (
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
          <Box
            onTouchStart={handleTouchStart}
            sx={{
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
              width: "100%",
              minHeight: 40,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 6,
                borderRadius: 3,
                bgcolor: "#ccc",
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              pointerEvents: "auto",
              touchAction: "auto",
            }}
          >
            <EtapDrawerContent units={units} initResponse={initResponse} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
