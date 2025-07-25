import { ThemeOptionsEnum } from "@enums/ThemeOptionsEnum";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAppReducer } from "./IAppReducer";

const initialState: IAppReducer = {
  theme: ThemeOptionsEnum.LIGHT,
  opsModalVisible: false,
  opsModalData: null,
  generalLoading: false,
  languageLoading: true,
  languages: [],
  errorMessages: {
    tr: "Beklenmedik bir hata oluştu lütfen daha sonra tekrar deneyiniz! Sorun çözülmez ise yetkililer ile iletişime geçiniz...",
    en: "An unexpected error occurred, please try again later! If the problem is not solved, contact the authorities...",
  },
  connectionErrorMessages: {
    tr: "İnternet bağlantınız yok. Lütfen bağlantınızı kontrol edin.",
    en: "You have no internet connection. Please check your connection.",
  },
};

export const appSlice = createSlice({
  name: "appReducer",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<any>) => {
      state = { ...state, theme: action.payload };
      return state;
    },
    setOpsModalVisible: (state, action: PayloadAction<boolean>) => {
      state.opsModalVisible = action.payload;
    },
    setOpsModalData: (state, action: PayloadAction<any>) => {
      state.opsModalData = action.payload;
    },
    setGeneralLoading: (state, action: PayloadAction<boolean>) => {
      state.generalLoading = action.payload;
      return state;
    },
    setLanguageLoading: (state, action: PayloadAction<boolean>) => {
      state.languageLoading = action.payload;
      return state;
    },
    setLanguages: (state, action: PayloadAction<any>) => {
      state.languages = action.payload;
      return state;
    },
  },
});

export const {
  setTheme,
  setOpsModalVisible,
  setOpsModalData,
  setGeneralLoading,
  setLanguageLoading,
  setLanguages,
} = appSlice.actions;

export default appSlice.reducer;
