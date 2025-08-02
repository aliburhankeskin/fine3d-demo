"use client";
import { IUnitState } from "./IUnitState";
import { IUnitTemplatesType } from "./IUnitTemplatesType";
import { IUnitTypeModel } from "./IUnitTypeModel";

export interface IPresentationInitResponse {
  startingEntity: number;
  projectId: number;
  projectName: string;
  projectSlogan: string;
  startMode: number;
  themeObject: any;
  canvasConfig: any;
  compassInitialDegree: any;
  companyName: string;
  unitStates: IUnitState[];
  unitTemplates: IUnitTemplatesType[];
  unitTypes: IUnitTypeModel[];
  companyLogo: any;
}
