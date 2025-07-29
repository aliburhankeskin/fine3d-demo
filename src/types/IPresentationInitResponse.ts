"use client";
import { IUnitState } from "./IUnitState";
import { IUnitTemplate } from "./IUnitTemplate";
import { IUnitType } from "./IUnitType";

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
  unitTemplates: IUnitTemplate[];
  unitTypes: IUnitType[];
  companyLogo: any;
}
