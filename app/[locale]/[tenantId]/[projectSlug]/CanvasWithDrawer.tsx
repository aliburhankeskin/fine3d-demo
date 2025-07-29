"use client";

import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { ITagItem } from "@/types/ITagItem";
import OriginalCanvas from "./Canvas";

const MIN_DRAWER_HEIGHT = 100;

export default function CanvasWithDrawer({
  workspaceItems,
  config,
  tabBarData,
  rightBarData,
}: {
  workspaceItems?: ITagItem[];
  config?: any;
  tabBarData?: any;
  rightBarData?: any;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
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

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging) return;

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
      window.addEventListener("touchend", handleTouchEnd);
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

  const isDrawerAtMax = drawerHeight >= MAX_DRAWER_HEIGHT - 1;

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
          onTouchStart={handleTouchStart}
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
            cursor: "grab",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
              width: "100%",
              minHeight: 50,
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
              px: 2,
              pb: 2,
              WebkitOverflowScrolling: "touch",
              pointerEvents: isDrawerAtMax ? "auto" : "none",
            }}
          >
            {rightBarData && (
              <List
                height={drawerHeight - 40}
                itemCount={rightBarData.length}
                itemSize={48}
                width={"100%"}
                itemData={rightBarData}
                style={{ background: "transparent" }}
              >
                {({ index, style, data }: ListChildComponentProps) => {
                  const item = data[index];
                  return (
                    <div style={style} key={index}>
                      <DrawerInfoRow
                        label={item?.name}
                        value={item.floor?.name}
                      />
                    </div>
                  );
                }}
              </List>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

const DrawerInfoRow = React.memo(
  ({ label, value }: { label: string; value: string }) => (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontSize={14} color="text.secondary">
          {label}
        </Typography>
        <Typography fontSize={14} fontWeight={600}>
          {value}
        </Typography>
      </Box>
      <Divider
        sx={{
          borderStyle: "dashed",
        }}
      />
    </>
  )
);

DrawerInfoRow.displayName = "DrawerInfoRow";
