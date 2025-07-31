"use client";

import React, { useState, useMemo } from "react";
import { Box, Card, Typography, Fade } from "@mui/material";
import { IPolygonModel } from "@/types/IPolygonModel";

interface PolygonOverlayProps {
  polygons: IPolygonModel[];
  containerWidth: number;
  containerHeight: number;
  imageWidth?: number;
  imageHeight?: number;
}

interface PolygonCardProps {
  polygon: IPolygonModel;
  mousePosition: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
}

const PolygonCard: React.FC<PolygonCardProps> = ({
  polygon,
  mousePosition,
  containerWidth,
  containerHeight,
}) => {
  // Card'ın ekran dışına çıkmasını engelle
  const cardWidth = 250;
  const cardHeight = 120;

  const adjustedX = Math.min(
    Math.max(mousePosition.x + 15, 10),
    containerWidth - cardWidth - 10
  );

  const adjustedY = Math.min(
    Math.max(mousePosition.y - 60, 10),
    containerHeight - cardHeight - 10
  );

  return (
    <Card
      sx={{
        position: "absolute",
        left: adjustedX,
        top: adjustedY,
        width: cardWidth,
        backgroundColor: "rgba(122, 144, 73, 0.8)",
        color: "white",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        pointerEvents: "none",
        transform: "translateZ(0)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontSize: "14px", fontWeight: 600, mb: 1 }}
        >
          Blok Adı
        </Typography>

        {polygon.entityTypeDescription && (
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", mb: 0.5, opacity: 0.8 }}
          >
            Tip: {polygon.entityTypeDescription}
          </Typography>
        )}

        {polygon.navigationTypeDescription && (
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", mb: 0.5, opacity: 0.8 }}
          >
            Navigasyon: {polygon.navigationTypeDescription}
          </Typography>
        )}

        {polygon.navigationValue && (
          <Typography variant="body2" sx={{ fontSize: "12px", opacity: 0.7 }}>
            Değer: {polygon.navigationValue}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default function PolygonOverlay({
  polygons,
  containerWidth,
  containerHeight,
  imageWidth = 1920,
  imageHeight = 1080,
}: PolygonOverlayProps) {
  const [hoveredPolygon, setHoveredPolygon] = useState<IPolygonModel | null>(
    null
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const convertToScreenCoordinates = useMemo(() => {
    return (point: { x: number; y: number }) => {
      const geometryWidth = 16;
      const geometryHeight = 9;
      const cameraHeight = 9;
      const containerAspect = containerWidth / containerHeight;
      const cameraWidth = cameraHeight * containerAspect;
      const worldX =
        (point.x / (imageWidth || 1920)) * geometryWidth - geometryWidth / 2;
      const worldY =
        geometryHeight / 2 - (point.y / (imageHeight || 1080)) * geometryHeight;
      const screenX =
        ((worldX + cameraWidth / 2) / cameraWidth) * containerWidth;
      const screenY =
        ((cameraHeight / 2 - worldY) / cameraHeight) * containerHeight;

      return {
        x: screenX,
        y: screenY,
      };
    };
  }, [containerWidth, containerHeight, imageWidth, imageHeight]);

  const createPolygonPath = (points: { x: number; y: number }[]) => {
    const pathString =
      points
        .map((point, index) => {
          const screenPoint = convertToScreenCoordinates(point);
          return `${index === 0 ? "M" : "L"} ${screenPoint.x} ${screenPoint.y}`;
        })
        .join(" ") + " Z";

    return pathString;
  };
  const handlePolygonHover = (
    polygon: IPolygonModel,
    event: React.MouseEvent
  ) => {
    setHoveredPolygon(polygon);
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handlePolygonLeave = () => {
    setHoveredPolygon(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredPolygon) {
      const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handlePolygonClick = (polygon: IPolygonModel) => {
    if (polygon.navigationValue && polygon.navigationType) {
      console.log("Navigate to:", polygon.navigationValue);
      // Örnek: router.push(polygon.navigationValue);x
    }
  };

  if (!polygons || polygons.length === 0) {
    console.log("PolygonOverlay: No polygons to render, polygons:", polygons);
    return null;
  }

  if (polygons.length > 0 && polygons[0].points.length > 0) {
    const firstPoint = polygons[0].points[0];
    const converted = convertToScreenCoordinates(firstPoint);
  }

  return (
    <>
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 999,
        }}
        onMouseMove={handleMouseMove}
      >
        {polygons.map((polygon, index) => (
          <path
            key={`${polygon.id}-${index}`}
            d={createPolygonPath(polygon.points)}
            fill={
              hoveredPolygon?.id === polygon.id
                ? "rgba(122, 144, 73, 0.4)"
                : "transparent"
            }
            stroke={
              hoveredPolygon?.id === polygon.id
                ? "rgba(122, 144, 73, 0.8)"
                : "transparent"
            }
            strokeWidth={hoveredPolygon?.id === polygon.id ? "3" : "1"}
            style={{
              pointerEvents: "auto",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              filter:
                hoveredPolygon?.id === polygon.id
                  ? "drop-shadow(0 0 12px rgba(122, 144, 73, 0.6))"
                  : "none",
            }}
            onMouseEnter={(e) => handlePolygonHover(polygon, e)}
            onMouseLeave={handlePolygonLeave}
            onClick={() => handlePolygonClick(polygon)}
          />
        ))}
      </svg>

      {/* Hover Card */}
      {hoveredPolygon && (
        <Fade in={!!hoveredPolygon} timeout={200}>
          <Box>
            <PolygonCard
              polygon={hoveredPolygon}
              mousePosition={mousePosition}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          </Box>
        </Fade>
      )}
    </>
  );
}
