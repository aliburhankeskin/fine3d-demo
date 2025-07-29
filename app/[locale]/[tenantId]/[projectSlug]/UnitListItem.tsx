"use client";
import React from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IUnitTemplate } from "../../../../src/types/IUnitTemplate";
import { IUnitType } from "../../../../src/types/IUnitType";

const UnitListItem = ({ index, style, data }: any) => {
  const t = useTranslations("Common");
  const {
    items,
    viewMode,
    favoriteItems,
    toggleFavorite,
    unitTypes,
    getNetArea,
    getGrossArea,
  } = data;

  // Son item için boş padding alanı
  if (index >= items.length) {
    return (
      <div style={style}>
        <Box sx={{ height: "60px" }}></Box>
      </div>
    );
  }

  const unit: IUnitTemplate = items[index];
  const isFavorite = favoriteItems.has(index);

  if (!unit || typeof unit !== "object" || !unit.name) {
    return (
      <div style={style}>
        <Box sx={{ p: 1 }}>
          <Card elevation={0} sx={{ borderRadius: 2, height: "190px" }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography color="text.secondary">{t("Loading")}</Typography>
            </Box>
          </Card>
        </Box>
      </div>
    );
  }

  const getRoomName = (unit: IUnitTemplate): string => {
    const unitType = unitTypes?.find(
      (type: IUnitType) => type.id === unit.unitTypeId
    );
    return unitType?.name || "N/A";
  };

  const getFacadeDirection = (unit: IUnitTemplate): string => {
    // facades array'inden direction çıkar
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

  const getNetAreaFromTemplate = (unit: IUnitTemplate): number => {
    // Ana component'teki getNetArea fonksiyonunu kullan
    return getNetArea ? getNetArea(unit) : unit.netArea || 0;
  };

  const getGrossAreaFromTemplate = (unit: IUnitTemplate): number => {
    // Ana component'teki getGrossArea fonksiyonunu kullan
    return getGrossArea ? getGrossArea(unit) : unit.grossArea || 0;
  };

  const safeUnitName = String(unit.name || "N/A");
  const safeFloor = unit.floor?.number?.toString() || "1";
  const safeRoomCount = getRoomName(unit);
  const safeFacadeDirection = getFacadeDirection(unit);
  const safeNetArea = String(getNetAreaFromTemplate(unit));
  const safeGrossArea = String(getGrossAreaFromTemplate(unit));

  if (viewMode === "card") {
    return (
      <div style={style}>
        <Box sx={{ p: 1 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              height: "190px",
              bgcolor: "card2.main",
            }}
          >
            <Stack direction="row" spacing={2} sx={{ p: 2, height: "100%" }}>
              <CardMedia
                component="img"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: 3,
                  objectFit: "contain",
                  bgcolor: "white",
                  flexShrink: 0,
                  p: 2,
                }}
                image={unit.image?.url || "/placeholder.png"}
                alt={`Unit ${safeUnitName} floor plan`}
              />

              {/* Unit Info */}
              <Stack spacing={1} sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontSize="1rem"
                  >
                    {safeUnitName}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(index)}
                    sx={{
                      color: isFavorite ? "error.main" : "grey.400",
                      "&:hover": {
                        color: "error.main",
                        transform: "scale(1.1)",
                      },
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
        </Box>
      </div>
    );
  }

  // List view
  return (
    <div style={style}>
      <Box sx={{ px: 2 }}>
        <Box
          sx={{
            py: 1,
            height: "58px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px dashed",
            borderColor: "grey.300",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "grey.50",
            },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ flex: 1 }}
            >
              <Box sx={{ minWidth: 40, textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {safeFloor}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 50, textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {safeRoomCount}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 50, textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {getNetAreaFromTemplate(unit)}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 50, textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {getGrossAreaFromTemplate(unit)}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 60, textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  {safeFacadeDirection}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 40, textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  -
                </Typography>
              </Box>
            </Stack>

            <IconButton
              size="small"
              onClick={() => toggleFavorite(index)}
              sx={{
                color: isFavorite ? "error.main" : "grey.400",
                "&:hover": {
                  color: "error.main",
                  transform: "scale(1.1)",
                },
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};
export default UnitListItem;
