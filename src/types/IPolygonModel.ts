import { EntityTypeEnum } from "@enums/EntityTypeEnum";
import { NavigationTypeEnum } from "@enums/NavigationTypeEnum";
import { PolygonTypeEnum } from "@enums/PolygonTypeEnum";

export interface ISvgPoint {
  x: number;
  y: number;
}

export interface IPolygonModel {
  id: string;
  type?: PolygonTypeEnum;
  typeDescription: string | null;
  entityType?: EntityTypeEnum;
  entityTypeDescription: string | null;
  relatedEntityId?: number | null;
  navigationType?: NavigationTypeEnum;
  navigationTypeDescription: string | null;
  navigationId?: number | null;
  navigationValue?: string | null;
  points: ISvgPoint[];
}
