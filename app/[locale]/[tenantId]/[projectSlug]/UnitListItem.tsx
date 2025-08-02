"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IUnitItem } from "../../../../src/types/IUnitItem";
import { IUnitTypeModel } from "../../../../src/types/IUnitTypeModel";

const UnitListItem = ({ index, style, data }: any) => {
  const t = useTranslations("Common");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    items,
    viewMode,
    favoriteItems,
    toggleFavorite,
    unitTypes,
    getNetArea,
    getGrossArea,
    handleUnitClick,
  } = data;

  const [imageError, setImageError] = React.useState(false);
  const unit: IUnitItem = items[index];
  const isFavorite = favoriteItems.has(index);

  useEffect(() => {
    setImageError(false);
  }, [unit?.image?.url]);

  if (index >= items.length) {
    return (
      <div style={style}>
        <Box sx={{ height: "60px" }}></Box>
      </div>
    );
  }

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

  const getRoomName = (unit: IUnitItem): string => {
    const unitType = unitTypes?.find(
      (type: IUnitTypeModel) => type.id === unit.unitTypeId
    );
    return unitType?.name || "N/A";
  };

  const getFacadeDirection = (unit: IUnitItem): string => {
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

  const getNetAreaFromTemplate = (unit: IUnitItem): number => {
    // Ana component'teki getNetArea fonksiyonunu kullan
    return getNetArea ? getNetArea(unit) : unit.netArea || 0;
  };

  const getGrossAreaFromTemplate = (unit: IUnitItem): number => {
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
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
            }}
            onClick={() => handleUnitClick && handleUnitClick(unit)}
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
                  sizes="(max-width: 768px) 100vw, 150px"
                  priority={index < 5} // İlk 5 resmi öncelikli yükle
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
      <Box sx={{ px: { xs: 1, md: 2 } }}>
        <Box
          sx={{
            py: { xs: 0.5, md: 1 },
            height: { xs: "50px", md: "58px" },
            display: "flex",
            alignItems: "center",
            borderBottom: "1px dashed",
            borderColor: "grey.300",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "grey.50",
            },
          }}
          onClick={() => handleUnitClick && handleUnitClick(unit)}
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
              sx={{ flex: 1, width: "100%" }}
            >
              <Box sx={{ flex: isMobile ? 0.8 : 1, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                >
                  {safeFloor}
                </Typography>
              </Box>

              <Box sx={{ flex: isMobile ? 1.2 : 1.5, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                  noWrap
                >
                  {isMobile ? safeRoomCount.slice(0, 3) : safeRoomCount}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                >
                  {getNetAreaFromTemplate(unit)}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.75rem", md: "0.8rem" } }}
                >
                  {getGrossAreaFromTemplate(unit)}
                </Typography>
              </Box>

              <Box sx={{ flex: isMobile ? 0.8 : 1.5, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  noWrap
                >
                  {isMobile ? "Fa" : safeFacadeDirection}
                </Typography>
              </Box>

              {!isMobile && ( // Desktop'ta ekstra sütun
                <Box sx={{ flex: 0.8, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                    -
                  </Typography>
                </Box>
              )}
            </Stack>

            <IconButton
              size={isMobile ? "small" : "small"}
              onClick={() => toggleFavorite(index)}
              sx={{
                color: isFavorite ? "error.main" : "grey.400",
                "&:hover": {
                  color: "error.main",
                  transform: "scale(1.1)",
                },
                p: { xs: 0.5, md: 1 },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon fontSize={isMobile ? "small" : "medium"} />
              ) : (
                <FavoriteBorderIcon fontSize={isMobile ? "small" : "medium"} />
              )}
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};
export default UnitListItem;
