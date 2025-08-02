"use client";
import React, { useRef, useEffect } from "react";
import { useAppSelector } from "@redux/hooks";
import { Box, ButtonBase } from "@mui/material";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";
import usePresentation from "./usePresentation";

interface StaticButton {
  Id: string;
  Name: string;
}

interface BottomFloatingBarProps {
  maxWidth?: number;
}

const BottomFloatingBar = ({ maxWidth = 600 }: BottomFloatingBarProps) => {
  const { hadndleChangePresentation } = usePresentation();
  const {
    presentationInitResponse,
    currentEntityType,
    currentEntityId,
    tabBarContentResponse,
  } = useAppSelector((state) => state.AppReducer);

  const staticButtons: StaticButton[] =
    currentEntityType === EntityTypeEnum.Project || EntityTypeEnum.Block
      ? [
          {
            Id: "-1",
            Name: "Proje Görünümü",
          },
        ]
      : [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const allItems = [
    ...staticButtons,
    ...(tabBarContentResponse[0]?.data || []),
  ];

  const getActiveIndex = () => {
    if (currentEntityType === EntityTypeEnum.Project) {
      return 0;
    }

    const tabBarItems = tabBarContentResponse[0]?.data || [];

    const foundIndex = tabBarItems.findIndex((item: any) => {
      const itemId = item.Id;
      const currentId = currentEntityId;

      return (
        itemId == currentId ||
        String(itemId) === String(currentId) ||
        Number(itemId) === Number(currentId)
      );
    });

    if (foundIndex !== -1) {
      const finalIndex = staticButtons.length + foundIndex;
      return finalIndex;
    }

    return 0;
  };

  const activeIndex = getActiveIndex();

  const tabWidth = 125;
  const horizontalPadding = 12;
  const verticalPadding = 6;

  const handleWheel = (e: React.WheelEvent) => {
    if (!isScrollable || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    container.scrollLeft += e.deltaY;
  };

  const totalWidth = tabWidth * allItems.length + horizontalPadding * 2;
  const containerWidth = Math.min(totalWidth, maxWidth);

  const isScrollable = totalWidth > maxWidth;

  useEffect(() => {
    const scrollToActiveItem = (index: number) => {
      if (!scrollContainerRef.current || !isScrollable) return;

      const container = scrollContainerRef.current;
      const itemPosition = index * tabWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;

      if (itemPosition < scrollLeft) {
        container.scrollLeft = itemPosition;
      } else if (itemPosition + tabWidth > scrollLeft + containerWidth) {
        container.scrollLeft = itemPosition + tabWidth - containerWidth;
      }
    };

    scrollToActiveItem(activeIndex);
  }, [currentEntityType, currentEntityId, isScrollable, activeIndex, tabWidth]);

  const handleClick = (index: number) => {
    switch (currentEntityType) {
      case EntityTypeEnum.Project:
      case EntityTypeEnum.Block:
        if (index === 0) {
          hadndleChangePresentation(
            EntityTypeEnum.Project,
            presentationInitResponse?.projectId
          );
        } else {
          hadndleChangePresentation(EntityTypeEnum.Block, allItems[index]?.Id);
        }
        break;

      default:
        break;
    }
  };

  return allItems?.length <= 1 ? null : (
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
        zIndex: 9999999,
        px: `${horizontalPadding}px`,
        py: `${verticalPadding}px`,
        width: containerWidth,
        height: "auto",
        overflow: isScrollable ? "visible" : "hidden",
        boxShadow: 3,
      }}
    >
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
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {allItems?.map((block: any, index: number) => {
          return (
            <ButtonBase
              key={block?.Id}
              onClick={() => handleClick(index)}
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
