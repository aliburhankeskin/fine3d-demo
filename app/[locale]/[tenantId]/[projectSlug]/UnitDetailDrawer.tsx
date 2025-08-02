"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Divider,
  Chip,
  Card,
  Drawer,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LayersIcon from "@mui/icons-material/Layers";
import HomeIcon from "@mui/icons-material/Home";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import { IUnitItem } from "../../../../src/types/IUnitItem";
import { IUnitTypeModel } from "../../../../src/types/IUnitTypeModel";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { setSelectedUnitId, setUnitDetailDrawerOpen } from "@redux/appSlice";
import { ArrowBack } from "@mui/icons-material";

interface UnitDetailDrawerProps {
  unit: IUnitItem | null;
  unitTypes: IUnitTypeModel[];
  getNetArea: (unit: IUnitItem) => number;
  getGrossArea: (unit: IUnitItem) => number;
}

const UnitDetailDrawer: React.FC<UnitDetailDrawerProps> = ({
  unit,
  unitTypes,
  getNetArea,
  getGrossArea,
}) => {
  const { unitDetailDrawerOpen } = useAppSelector((state) => state.AppReducer);
  const t = useTranslations("Common");
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleClose = () => {
    dispatch(setUnitDetailDrawerOpen(false));
    dispatch(setSelectedUnitId(null));
  };

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

  if (!unit) return null;

  return (
    <Drawer
      id="unit-detail-drawer"
      variant="persistent"
      open={unitDetailDrawerOpen}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          marginRight: "0px",
          width: "400px",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          p: 2,
        }}
      >
        <Chip
          icon={<ArrowBack sx={{ cursor: "pointer" }} />}
          onClick={handleClose}
          label={unit.block?.name || "A Blok"}
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            height: 32,
            cursor: "pointer",
            "& .MuiChip-icon": {
              fontSize: "1rem",
              ml: 1,
            },
          }}
        />
        <IconButton
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{
            color: isFavorite ? "error.main" : "grey.400",
            "&:hover": {
              color: "error.main",
            },
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Stack>

      {/* Unit Name with Heart */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1.5 }}
      >
        <Typography fontSize={18} fontWeight={600} color="primary.main">
          {unit.name}
        </Typography>
        <IconButton
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{
            color: isFavorite ? "error.main" : "grey.400",
            "&:hover": {
              color: "error.main",
            },
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Stack>
      <Card
        elevation={0}
        sx={{
          m: 2,
          mb: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={
              imageError
                ? "/placeholder.png"
                : unit.image?.url || "/placeholder.png"
            }
            alt={`Unit ${unit.name} floor plan`}
            fill
            style={{
              objectFit: "contain",
              padding: "16px",
            }}
            onError={() => setImageError(true)}
          />
        </Box>
      </Card>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {/* Three Info Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {/* Floor Info Card */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <LayersIcon color="action" />
            <Typography variant="body2">
              {unit.floor?.number || "5"}. Kat
            </Typography>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <HomeIcon color="action" />
            <Typography variant="body2">2+1</Typography>
          </Card>

          {/* Gross Area Info Card */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <SquareFootIcon color="action" />
            <Typography variant="body2"> {getGrossArea(unit)}m²</Typography>
          </Card>
        </Stack>
        {/* All Information List */}
        <Box sx={{ bgcolor: "white", borderRadius: 2, overflow: "hidden" }}>
          {/* Floor */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {t("Floor")}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {unit.floor?.name || unit.floor?.number || "N/A"}
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Room */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {t("Room")}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {getRoomName(unit)}
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Direction */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Çepheli
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {getFacadeDirection(unit)}
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Net Area */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {t("NetArea")}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {getNetArea(unit)} m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Gross Area */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {t("GrossArea")}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {getGrossArea(unit)} m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Block */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {t("Block")}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {unit.block?.name || "N/A"}
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Stage */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {t("Stage")}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {unit.stage?.name || "N/A"}
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Banyo Sayısı */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Banyo Sayısı
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              2 Adet
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Salon */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Salon
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              30m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Oturma Odası */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Oturma Odası
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              17m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Kiler */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Kiler
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              4m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Mutfak */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Mutfak
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              18m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Livl-Wc */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Livl-Wc
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              3m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Banyo */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Banyo
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              6m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Yatak Odası */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Yatak Odası
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              12m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Ebeveyn Yatak Odası */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Ebeveyn Yatak Odası
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              16m²
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Duş */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Duş
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              4m²
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UnitDetailDrawer;
