import { ThemeOptionsEnum } from "@enums/ThemeOptionsEnum";
import { ILanguageDto } from "@/types/ILanguageDto";

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
}
