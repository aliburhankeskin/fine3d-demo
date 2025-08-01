"use client";
import React, { useState, useRef } from "react";
import { useAppSelector } from "@redux/hooks";
import { Box, ButtonBase } from "@mui/material";

interface StaticButton {
  id: string;
  name: string;
  onClick?: () => void;
}

interface BottomFloatingBarProps {
  staticButtons?: StaticButton[];
  maxWidth?: number;
}

const BottomFloatingBar = ({
  staticButtons = [],
  maxWidth = 600,
}: BottomFloatingBarProps) => {
  const tabBarContentResponse =
    useAppSelector((state) => state.AppReducer?.tabBarContentResponse) || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabWidth = 125;
  const horizontalPadding = 12;
  const verticalPadding = 6;

  const handleWheel = (e: React.WheelEvent) => {
    if (!isScrollable || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    container.scrollLeft += e.deltaY;
  };

  const allItems = [
    ...staticButtons,
    ...(tabBarContentResponse[0]?.data || []),
  ];
  const totalWidth = tabWidth * allItems.length + horizontalPadding * 2;
  const containerWidth = Math.min(totalWidth, maxWidth);
  const isScrollable = totalWidth > maxWidth;

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
        width: containerWidth,
        height: "auto",
        overflow: isScrollable ? "visible" : "hidden",
        boxShadow: 3,
      }}
    >
      {/* Sliding indicator - sadece scrollable değilse göster */}
      {!isScrollable && (
        <Box
          sx={{
            position: "absolute",
            top: `${verticalPadding}px`,
            left: `${horizontalPadding}px`,
            width: tabWidth,
            height: `calc(100% - ${verticalPadding * 2}px)`,
            bgcolor: "#7A9049",
            borderRadius: 999,
            transform: `translateX(${activeIndex * tabWidth}px)`,
            transition: "transform 300ms ease",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}

      {/* Scrollable container */}
      <Box
        ref={scrollContainerRef}
        onWheel={handleWheel}
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: isScrollable ? "auto" : "visible",
          overflowY: "visible",
          width: isScrollable
            ? `${maxWidth - horizontalPadding * 2}px`
            : "100%",
          maxWidth: isScrollable
            ? `${maxWidth - horizontalPadding * 2}px`
            : "100%",
          gap: 0,
          // Hide scrollbar completely
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Statik butonlar */}
        {staticButtons.map((button, index) => (
          <ButtonBase
            key={button.id}
            onClick={() => {
              setActiveIndex(index);
              button.onClick?.();
            }}
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
              bgcolor: activeIndex === index ? "#7A9049" : "transparent",
              "&:hover": {
                bgcolor:
                  activeIndex === index ? "#7A9049" : "rgba(47, 61, 94, 0.1)",
              },
              "&:active": { bgcolor: "transparent" },
              minHeight: "36px",
              flexShrink: 0,
              transition: "background-color 300ms ease",
            }}
          >
            {button.name}
          </ButtonBase>
        ))}

        {allItems?.map((block: any, index: number) => {
          const adjustedIndex = index + staticButtons.length;
          return (
            <ButtonBase
              key={block?.Id}
              onClick={() => setActiveIndex(adjustedIndex)}
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
                color: activeIndex === adjustedIndex ? "#fff" : "#333",
                bgcolor:
                  activeIndex === adjustedIndex ? "#7A9049" : "transparent",
                "&:hover": {
                  bgcolor: "#7A9049",
                  color: "#fff",
                },
                "&:active": { bgcolor: "transparent" },
                minHeight: "36px",
                flexShrink: 0,
                transition: "background-color 300ms ease",
              }}
            >
              {block?.Name}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};

export default BottomFloatingBar;
