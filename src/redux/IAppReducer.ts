import { ThemeOptionsEnum } from "@enums/ThemeOptionsEnum";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";
import { ILanguageDto } from "@/types/ILanguageDto";
import { IPresentationInitResponse } from "@/types/IPresentationInitResponse";

export interface IAppReducer {
  theme: ThemeOptionsEnum;
  opsModalVisible: boolean;
  opsModalData?: any;
  generalLoading: boolean;
  languageLoading: boolean;
  languages: ILanguageDto[];
  drawerOpen: boolean;
  errorMessages: {
    tr: string;
    en: string;
  };
  connectionErrorMessages: {
    tr: string;
    en: string;
  };
  presentationInitResponse: IPresentationInitResponse | null;
  presentationResponse: any | null;
  tabBarContentResponse: any | null;
  rightBarContentResponse: any | null;
  currentEntityType: EntityTypeEnum | null;
  currentEntityId: string | null;
  selectedUnitId: number | null;
  unitDetailDrawerOpen: boolean;
}
