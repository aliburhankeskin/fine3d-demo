"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { FixedSizeList as List } from "react-window";
import UnitFilter, { FilterValues } from "./UnitFilter";
import { IUnitTemplate } from "../../../../src/types/IUnitTemplate";
import { IPresentationInitResponse } from "../../../../src/types/IPresentationInitResponse";
import UnitListItem from "./UnitListItem";

interface EtapDrawerContentProps {
  initResponse?: IPresentationInitResponse;
  units?: IUnitTemplate[];
}

type ViewMode = "card" | "list";

const EtapDrawerContent: React.FC<EtapDrawerContentProps> = ({
  initResponse = {
    startingEntity: 1,
    projectId: 1,
    projectName: "",
    projectSlogan: "",
    startMode: 1,
    themeObject: null,
    canvasConfig: null,
    compassInitialDegree: null,
    companyName: "",
    unitStates: [],
    unitTemplates: [],
    unitTypes: [],
    companyLogo: null,
  },
  units = [],
}) => {
  const t = useTranslations("Common");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [filters, setFilters] = useState<FilterValues>({
    roomCount: [],
    floorRange: [0, 10],
    areaRange: [0, 300],
    status: "",
    direction: "",
  });
  const [favoriteItems, setFavoriteItems] = useState<Set<number>>(new Set());

  const unitData = useMemo(() => units || [], [units]);

  const unitTemplates = useMemo(
    () => initResponse?.unitTemplates || [],
    [initResponse?.unitTemplates]
  );

  const unitTypes = useMemo(
    () => initResponse?.unitTypes || [],
    [initResponse?.unitTypes]
  );

  const getUnitTypeName = useCallback(
    (unitTypeId: number): string => {
      const unitType = unitTypes.find((type) => type.id === unitTypeId);
      return unitType?.name || "N/A";
    },
    [unitTypes]
  );

  const getRoomCount = useCallback(
    (unit: IUnitTemplate): string => {
      return getUnitTypeName(unit.unitTypeId);
    },
    [getUnitTypeName]
  );

  const getUnitStatus = (unit: IUnitTemplate): string => {
    return "available";
  };

  const getNetArea = useCallback(
    (unit: IUnitTemplate): number => {
      const templateUnit = unitTemplates.find(
        (template) => template.id === unit?.templateId
      );

      return templateUnit?.netArea || unit.netArea || 0;
    },
    [unitTemplates]
  );

  const getGrossArea = useCallback(
    (unit: IUnitTemplate): number => {
      const templateUnit = unitTemplates.find(
        (template) => template.id === unit?.templateId
      );
      return templateUnit?.grossArea || unit.grossArea || 0;
    },
    [unitTemplates]
  );

  const getFacadeDirection = useCallback(
    (unit: IUnitTemplate): string => {
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
    },
    [t]
  );

  const filteredData = useMemo(() => {
    return unitData.filter((unit) => {
      if (!unit) return false;

      if (filters.roomCount.length > 0) {
        const roomCount = getRoomCount(unit);
        if (!filters.roomCount.includes(roomCount)) {
          return false;
        }
      }

      const floorNumber = unit.floor?.number || 0;
      if (
        floorNumber < filters.floorRange[0] ||
        floorNumber > filters.floorRange[1]
      ) {
        return false;
      }

      const netArea = getNetArea(unit);
      if (
        netArea > 0 &&
        (netArea < filters.areaRange[0] || netArea > filters.areaRange[1])
      ) {
        return false;
      }

      if (filters.status) {
        const status = getUnitStatus(unit);
        if (status !== filters.status) {
          return false;
        }
      }

      if (filters.direction) {
        const direction = getFacadeDirection(unit);
        if (direction !== filters.direction) {
          return false;
        }
      }

      return true;
    });
  }, [unitData, filters, getRoomCount, getNetArea, getFacadeDirection]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const toggleFavorite = (index: number) => {
    const newFavorites = new Set(favoriteItems);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavoriteItems(newFavorites);
  };

  const roomOptions = [
    ...new Set(unitData.map((unit) => getRoomCount(unit))),
  ].sort();

  const statusOptions = [
    ...new Set(unitData.map((unit) => getUnitStatus(unit))),
  ].map((status) => ({
    value: status,
    label:
      status === "available"
        ? t("Available")
        : status === "sold"
        ? t("Sold")
        : status === "reserved"
        ? t("Reserved")
        : status,
  }));

  const directionOptions = [
    ...new Set(
      unitData
        .map((unit) => getFacadeDirection(unit))
        .filter((dir) => dir !== t("Unknown"))
    ),
  ].map((direction) => ({
    value: direction,
    label: direction,
  }));

  const floorMax =
    unitData.length > 0
      ? Math.max(...unitData.map((unit) => unit.floor?.number || 0))
      : 10;
  const areaMax =
    unitData.length > 0
      ? Math.max(...unitData.map((unit) => getNetArea(unit) || 100))
      : 300;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
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
        <Typography fontSize={18} fontWeight={600}>
          {t("GeneralView")}
        </Typography>
        <IconButton>
          <Badge badgeContent={favoriteItems.size} color="primary">
            <FavoriteBorderIcon />
          </Badge>
        </IconButton>
      </Stack>

      <UnitFilter
        onFilterChange={handleFilterChange}
        roomOptions={roomOptions}
        statusOptions={statusOptions}
        directionOptions={directionOptions}
        floorMax={floorMax}
        areaMax={areaMax}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 2,
          py: 1.5,
          pb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {filteredData.length} {t("Units")}
        </Typography>

        <ButtonGroup
          size="small"
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            "& .MuiButton-root": {
              borderRadius: 0,
              "&:first-of-type": {
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
              "&:last-of-type": {
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
              "&.MuiButton-outlined": {
                color: "#595856",
                borderColor: "#595856",
                "&:hover": {
                  backgroundColor: "rgba(147, 145, 144, 0.1)",
                  borderColor: "#595856",
                },
              },
            },
          }}
        >
          <Button
            onClick={() => setViewMode("card")}
            variant={viewMode === "card" ? "contained" : "outlined"}
            color={viewMode === "card" ? "primary" : "inherit"}
            startIcon={<ViewModuleIcon fontSize="small" />}
          >
            {t("Card")}
          </Button>
          <Button
            onClick={() => setViewMode("list")}
            variant={viewMode === "list" ? "contained" : "outlined"}
            color={viewMode === "list" ? "primary" : "inherit"}
            startIcon={<ViewListIcon fontSize="small" />}
          >
            {t("List")}
          </Button>
        </ButtonGroup>
      </Stack>

      <Box sx={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        {viewMode === "list" && (
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ minWidth: 40, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {t("Floor")}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 50, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {t("Room")}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 50, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {t("Net")}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 50, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {t("Gross")}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 60, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {t("Facade")}
                </Typography>
              </Box>

              <Box sx={{ minWidth: 40, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  -
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <List
          height={
            typeof window !== "undefined" && window.innerHeight
              ? Math.max(
                  400,
                  window.innerHeight - (viewMode === "list" ? 240 : 200)
                )
              : 600
          }
          width="100%"
          itemCount={(filteredData.length || 0) + 2}
          itemSize={viewMode === "card" ? 200 : 60}
          itemData={{
            items: filteredData.length ? filteredData : [],
            viewMode,
            favoriteItems,
            toggleFavorite,
            unitTypes: unitTypes,
            getNetArea,
            getGrossArea,
          }}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#2F3D5E transparent",
          }}
          outerElementType={({ children, ...props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#2F3D5E",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#243147",
                },
              }}
              sx={{
                "& ::-webkit-scrollbar": {
                  width: "6px",
                },
                "& ::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "& ::-webkit-scrollbar-thumb": {
                  backgroundColor: "primary.main", // #2F3D5E
                  borderRadius: "3px",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
                "& *": {
                  scrollbarWidth: "thin",
                  scrollbarColor: "primary.main transparent",
                },
              }}
            >
              {children}
            </div>
          )}
        >
          {UnitListItem}
        </List>
      </Box>
    </Box>
  );
};

export default EtapDrawerContent;
