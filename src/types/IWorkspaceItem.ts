import { PresentationTypeEnum } from "@enums/PresentationTypeEnum";
import { IPolygonModel } from "./IPolygonModel";

export interface IWorkspaceItem {
  id?: string;
  presentationType?: PresentationTypeEnum;
  order?: number;
  mainFrame?: boolean;
  image?: {
    url?: string | null;
    altText?: string | null;
  };
  polygons?: IPolygonModel[];
}
