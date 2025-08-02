"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IUnitItem } from "../../../../src/types/IUnitItem";
import { IUnitTypeModel } from "../../../../src/types/IUnitTypeModel";

interface UnitHoverCardProps {
  unit: IUnitItem;
  unitTypes: IUnitTypeModel[];
  getNetArea: (unit: IUnitItem) => number;
  getGrossArea: (unit: IUnitItem) => number;
  position: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
}

const UnitHoverCard: React.FC<UnitHoverCardProps> = ({
  unit,
  unitTypes,
  getNetArea,
  getGrossArea,
  position,
  containerWidth,
  containerHeight,
}) => {
  const t = useTranslations("Common");
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getRoomName = (unit: IUnitItem): string => {
    const unitType = unitTypes?.find(
      (type: IUnitTypeModel) => type.id === unit.unitTypeId
    );
    return unitType?.name || "N/A";
  };

  const getFacadeDirection = (unit: IUnitItem): string => {
    if (unit.facades && unit.facades.length > 0) {
      const facade = unit.facades[0];
      const facadeMap: { [key: number]: string } = {
        0: t("North"),
        1: t("Northeast"),
        2: t("East"),
        4: t("Southeast"),
        5: t("South"),
        6: t("Southwest"),
        8: t("West"),
        9: t("Northwest"),
        10: t("Center"),
        15: t("Other"),
      };
      return facadeMap[facade] || t("Unknown");
    }
    return t("Unknown");
  };

  const getNetAreaFromTemplate = (unit: IUnitItem): number => {
    return getNetArea ? getNetArea(unit) : unit.netArea || 0;
  };

  const getGrossAreaFromTemplate = (unit: IUnitItem): number => {
    return getGrossArea ? getGrossArea(unit) : unit.grossArea || 0;
  };

  const safeUnitName = String(unit.name || "N/A");
  const safeFloor = unit.floor?.number?.toString() || "1";
  const safeRoomCount = getRoomName(unit);
  const safeFacadeDirection = getFacadeDirection(unit);
  const safeNetArea = String(getNetAreaFromTemplate(unit));
  const safeGrossArea = String(getGrossAreaFromTemplate(unit));

  const cardWidth = 350;
  const cardHeight = 190;

  const adjustedX = Math.min(
    Math.max(position.x + 15, 10),
    containerWidth - cardWidth - 10
  );

  const adjustedY = Math.min(
    Math.max(position.y - cardHeight - 10, 10),
    containerHeight - cardHeight - 10
  );

  return (
    <Card
      elevation={8}
      sx={{
        position: "absolute",
        left: adjustedX,
        top: adjustedY,
        width: cardWidth,
        borderRadius: 3,
        height: "190px",
        bgcolor: "card2.main",
        cursor: "pointer",
        zIndex: 2000,
        pointerEvents: "none",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        opacity: 0,
        transform: "scale(0.95)",
        animation: "unitCardFadeIn 0.15s ease-out forwards",
        "@keyframes unitCardFadeIn": {
          "0%": {
            opacity: 0,
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ p: 2, height: "100%" }}>
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: 3,
            bgcolor: "white",
            flexShrink: 0,
            p: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={
              imageError
                ? "/placeholder.png"
                : unit.image?.url || "/placeholder.png"
            }
            alt={`Unit ${safeUnitName} floor plan`}
            fill
            style={{
              objectFit: "contain",
            }}
            sizes="150px"
            onError={() => setImageError(true)}
          />
        </Box>

        {/* Unit Info */}
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight={600} fontSize="1rem">
              {safeUnitName}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              sx={{
                color: isFavorite ? "error.main" : "grey.400",
                "&:hover": {
                  color: "error.main",
                  transform: "scale(1.1)",
                },
                pointerEvents: "auto", // Allow heart icon to be clickable
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Stack>

          {/* Info Grid */}
          <Stack spacing={0.25}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {t("Floor")}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {safeFloor}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {t("Room")}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {safeRoomCount}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {t("NetArea")}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {safeNetArea}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {t("GrossArea")}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {safeGrossArea}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                {t("Facade")}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {safeFacadeDirection}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default UnitHoverCard;
