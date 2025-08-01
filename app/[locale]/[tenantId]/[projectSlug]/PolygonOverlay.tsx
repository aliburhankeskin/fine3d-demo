"use client";

import React, { useState, useMemo } from "react";
import { useAppSelector } from "@redux/hooks";
import { Box, Card, Typography, Fade } from "@mui/material";
import { IPolygonModel } from "@/types/IPolygonModel";
import { EntityTypeEnum } from "@/enums/EntityTypeEnum";
import usePresentation from "./usePresentation";

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
  blocks?: any[];
}

const PolygonCard: React.FC<PolygonCardProps> = ({
  polygon,
  mousePosition,
  containerWidth,
  containerHeight,
  blocks,
}) => {
  const cardWidth = 250;
  const cardHeight = polygon.entityType === EntityTypeEnum.Block ? 60 : 140;

  const adjustedX = Math.min(
    Math.max(mousePosition.x + 15, 10),
    containerWidth - cardWidth - 10
  );

  const adjustedY = Math.min(
    Math.max(mousePosition.y - 60, 10),
    containerHeight - cardHeight - 10
  );

  const getCardTitle = () => {
    switch (polygon.entityType) {
      case EntityTypeEnum.Block:
        return "Blok Bilgileri";
      case EntityTypeEnum.Floor:
        return "Kat Bilgileri";
      case EntityTypeEnum.Unit:
        return "Daire Bilgileri";
      case EntityTypeEnum.Project:
        return "Proje Bilgileri";
      case EntityTypeEnum.ProjectStage:
        return "Proje Aşaması";
      case EntityTypeEnum.Dollhouse:
        return "Dollhouse Bilgileri";
      default:
        return "Bilgiler";
    }
  };

  const getBlockName = (polygon: IPolygonModel) => {
    if (polygon.entityType === EntityTypeEnum.Block && blocks) {
      const block = blocks.find(
        (block: any) => block.Id === polygon.relatedEntityId
      );
      return block?.name || block?.Name || `${polygon.relatedEntityId} Blok`;
    }
    return null;
  };

  return (
    <Card
      sx={{
        position: "absolute",
        left: adjustedX,
        top: adjustedY,
        width: cardWidth,
        backgroundColor: "rgba(122, 144, 73, 0.95)",
        color: "white",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
        pointerEvents: "none",
        transform: "translateZ(0)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Box sx={{ p: polygon.entityType === EntityTypeEnum.Block ? 2 : 2.5 }}>
        {polygon.entityType === EntityTypeEnum.Block ? (
          <Typography
            variant="h6"
            sx={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}
          >
            {getBlockName(polygon)}
          </Typography>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{ fontSize: "16px", fontWeight: 700, mb: 1.5, color: "#fff" }}
            >
              {getCardTitle()}
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
              <Typography
                variant="body2"
                sx={{ fontSize: "12px", opacity: 0.7 }}
              >
                Değer: {polygon.navigationValue}
              </Typography>
            )}
          </>
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
  const { tabBarContentResponse } = useAppSelector((state) => state.AppReducer);
  const blocks = tabBarContentResponse?.find(
    (item: any) => item.entityName === "Block"
  )?.data;

  const { hadndleChangePresentation } = usePresentation();

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

  const getPolygonTopPoint = (points: { x: number; y: number }[]) => {
    const screenPoints = points.map((point) =>
      convertToScreenCoordinates(point)
    );
    const minY = Math.min(...screenPoints.map((point) => point.y));
    const centerX =
      screenPoints.reduce((sum, point) => sum + point.x, 0) /
      screenPoints.length;

    return { x: centerX, y: minY };
  };

  const getBlockName = (polygon: IPolygonModel) => {
    if (polygon.entityType === EntityTypeEnum.Block && blocks) {
      const block = blocks.find(
        (block: any) => block?.Id === polygon.relatedEntityId
      );
      return block?.name || block?.Name || `${polygon.relatedEntityId} Blok`;
    }
    return null;
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
    switch (polygon.entityType) {
      case EntityTypeEnum.Block:
        hadndleChangePresentation(
          polygon?.entityType,
          polygon?.relatedEntityId
        );
        break;

      case EntityTypeEnum.Floor:
        console.log("Floor clicked:", polygon);
        break;

      case EntityTypeEnum.Unit:
        console.log("Unit clicked:", polygon);
        break;

      case EntityTypeEnum.Project:
        console.log("Project clicked:", polygon);
        break;

      case EntityTypeEnum.ProjectStage:
        console.log("ProjectStage clicked:", polygon);
        break;

      case EntityTypeEnum.Dollhouse:
        console.log("Dollhouse clicked:", polygon);
        break;

      default:
        console.log("Unknown entity type clicked:", polygon);
        break;
    }
  };

  if (!polygons || polygons.length === 0) {
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
          <g key={`polygon-group-${polygon.id}-${index}`}>
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

            {polygon.entityType === EntityTypeEnum.Block &&
              getBlockName(polygon) && (
                <>
                  <g>
                    <circle
                      cx={getPolygonTopPoint(polygon.points).x}
                      cy={getPolygonTopPoint(polygon.points).y + 20}
                      r="8"
                      fill="rgba(122, 144, 73, 1)"
                      stroke="rgba(122, 144, 73, 1)"
                      strokeWidth="2"
                      style={{
                        pointerEvents: "none",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />

                    <line
                      x1={getPolygonTopPoint(polygon.points).x}
                      y1={getPolygonTopPoint(polygon.points).y + 20}
                      x2={getPolygonTopPoint(polygon.points).x}
                      y2={getPolygonTopPoint(polygon.points).y - 15}
                      stroke="rgba(122, 144, 73, 1)"
                      strokeWidth="2"
                      style={{
                        pointerEvents: "none",
                      }}
                    />

                    <rect
                      x={getPolygonTopPoint(polygon.points).x - 40}
                      y={getPolygonTopPoint(polygon.points).y - 40}
                      width="80"
                      height="25"
                      rx="12"
                      ry="12"
                      fill="rgba(122, 144, 73, 1)"
                      stroke="rgba(122, 144, 73, 1)"
                      strokeWidth="2"
                      style={{
                        pointerEvents: "none",
                        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
                      }}
                    />
                  </g>

                  <text
                    x={getPolygonTopPoint(polygon.points).x}
                    y={getPolygonTopPoint(polygon.points).y - 27}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fill: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {getBlockName(polygon)}
                  </text>
                </>
              )}
          </g>
        ))}
      </svg>
      {hoveredPolygon && (
        <Fade in={!!hoveredPolygon} timeout={200}>
          <Box>
            <PolygonCard
              polygon={hoveredPolygon}
              mousePosition={mousePosition}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              blocks={blocks}
            />
          </Box>
        </Fade>
      )}
    </>
  );
}
