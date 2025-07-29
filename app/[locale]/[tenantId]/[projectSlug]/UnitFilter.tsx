"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  Chip,
  Slider,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  Stack,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Types for filter values
export interface FilterValues {
  roomCount: string[];
  floorRange: [number, number];
  areaRange: [number, number];
  status: string;
  direction: string;
}

// Props interface
interface UnitFilterProps {
  initialValues?: Partial<FilterValues>;
  onFilterChange: (filters: FilterValues) => void;
  roomOptions?: string[];
  statusOptions?: Array<{ value: string; label: string }>;
  directionOptions?: Array<{ value: string; label: string }>;
  floorMax?: number;
  areaMax?: number;
  isCollapsed?: boolean;
}

// Default values

const defaultRoomOptions = ["2+1", "3+1", "4+1", "5+1"];

const defaultStatusOptions = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "reserved", label: "Reserved" },
];

const defaultDirectionOptions = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "northeast", label: "Northeast" },
  { value: "northwest", label: "Northwest" },
  { value: "southeast", label: "Southeast" },
  { value: "southwest", label: "Southwest" },
];

export default function UnitFilter({
  initialValues = {},
  onFilterChange,
  roomOptions = defaultRoomOptions,
  statusOptions = defaultStatusOptions,
  directionOptions = defaultDirectionOptions,
  floorMax = 6,
  areaMax = 6,
  isCollapsed = false,
}: UnitFilterProps) {
  const t = useTranslations("Common");

  // Ensure max values are valid numbers
  const safeFloorMax = isNaN(floorMax) || floorMax <= 0 ? 10 : floorMax;
  const safeAreaMax = isNaN(areaMax) || areaMax <= 0 ? 300 : areaMax;

  // Create default values with dynamic ranges
  const getDefaultValues = (): FilterValues => ({
    roomCount: [],
    floorRange: [0, safeFloorMax],
    areaRange: [0, safeAreaMax],
    status: "",
    direction: "",
  });

  // Merge initial values with defaults
  const [filters, setFilters] = useState<FilterValues>({
    ...getDefaultValues(),
    ...initialValues,
  });

  const [collapsed, setCollapsed] = useState(isCollapsed);

  // Callback to update filters and notify parent
  const updateFilters = useCallback(
    (newFilters: Partial<FilterValues>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  // Room count handler
  const handleRoomCountChange = useCallback(
    (room: string) => {
      const currentRooms = filters.roomCount;
      const newRooms = currentRooms.includes(room)
        ? currentRooms.filter((r) => r !== room)
        : [...currentRooms, room];

      updateFilters({ roomCount: newRooms });
    },
    [filters.roomCount, updateFilters]
  );

  // Slider handlers
  const handleFloorChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      updateFilters({ floorRange: newValue as [number, number] });
    },
    [updateFilters]
  );

  const handleAreaChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      updateFilters({ areaRange: newValue as [number, number] });
    },
    [updateFilters]
  );

  // Select handlers
  const handleStatusChange = useCallback(
    (event: SelectChangeEvent) => {
      updateFilters({ status: event.target.value });
    },
    [updateFilters]
  );

  const handleDirectionChange = useCallback(
    (event: SelectChangeEvent) => {
      updateFilters({ direction: event.target.value });
    },
    [updateFilters]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        pt: 1,
        borderRadius: 1.5,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
          cursor: "pointer",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
          }}
        >
          {t("Filters")}
        </Typography>

        <IconButton size="small">
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      <Collapse in={!collapsed}>
        <Stack spacing={2.5}>
          <Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, fontWeight: 500, color: "text.primary" }}
            >
              {t("RoomCount")}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {roomOptions.map((room) => (
                <Chip
                  key={room}
                  label={room}
                  variant={
                    filters.roomCount.includes(room) ? "filled" : "outlined"
                  }
                  color={
                    filters.roomCount.includes(room) ? "primary" : "default"
                  }
                  onClick={() => handleRoomCountChange(room)}
                  size="small"
                  sx={{
                    borderRadius: 6,
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: 1,
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, fontWeight: 500, color: "text.primary" }}
              >
                {t("Floor")}
              </Typography>

              <Box sx={{ px: 1.5 }}>
                <Slider
                  value={filters.floorRange}
                  onChange={handleFloorChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={safeFloorMax}
                  size="small"
                  marks={[
                    { value: 0, label: "0" },
                    { value: safeFloorMax, label: safeFloorMax.toString() },
                  ]}
                  sx={{
                    color: "primary.main",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "primary.main",
                      border: "2px solid currentColor",
                      width: 16,
                      height: 16,
                      "&:hover": {
                        boxShadow: "0 0 0 6px rgba(25, 118, 210, 0.16)",
                      },
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "primary.main",
                      height: 3,
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "grey.300",
                      height: 3,
                    },
                    "& .MuiSlider-markLabel": {
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1.5, fontWeight: 500, color: "text.primary" }}
              >
                {t("GrossArea")}
              </Typography>

              <Box sx={{ px: 1.5 }}>
                <Slider
                  value={filters.areaRange}
                  onChange={handleAreaChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={safeAreaMax}
                  size="small"
                  marks={[
                    { value: 0, label: "0" },
                    { value: safeAreaMax, label: safeAreaMax.toString() },
                  ]}
                  sx={{
                    color: "primary.main",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "primary.main",
                      border: "2px solid currentColor",
                      width: 16,
                      height: 16,
                      "&:hover": {
                        boxShadow: "0 0 0 6px rgba(25, 118, 210, 0.16)",
                      },
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "primary.main",
                      height: 3,
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "grey.300",
                      height: 3,
                    },
                    "& .MuiSlider-markLabel": {
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            <Select
              fullWidth
              value={filters.status}
              onChange={handleStatusChange}
              displayEmpty
              size="small"
              sx={{
                borderRadius: 5,
                fontSize: "0.875rem",
                minWidth: 120,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.300",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              <MenuItem value="">
                <em>
                  {t("Clear")} {t("Status")}
                </em>
              </MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            <Select
              fullWidth
              value={filters.direction}
              onChange={handleDirectionChange}
              displayEmpty
              size="small"
              sx={{
                borderRadius: 5,
                fontSize: "0.875rem",
                minWidth: 120,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.300",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              <MenuItem value="">
                <em>
                  {t("Clear")} {t("Facade")}
                </em>
              </MenuItem>
              {directionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>
      </Collapse>
    </Paper>
  );
}
