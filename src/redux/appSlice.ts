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
  drawerOpen: true, // Varsayılan olarak açık
  errorMessages: {
    tr: "Beklenmedik bir hata oluştu lütfen daha sonra tekrar deneyiniz! Sorun çözülmez ise yetkililer ile iletişime geçiniz...",
    en: "An unexpected error occurred, please try again later! If the problem is not solved, contact the authorities...",
  },
  connectionErrorMessages: {
    tr: "İnternet bağlantınız yok. Lütfen bağlantınızı kontrol edin.",
    en: "You have no internet connection. Please check your connection.",
  },
  presentationInitResponse: null,
  presentationResponse: null,
  tabBarContentResponse: null,
  rightBarContentResponse: null,
  currentEntityType: null,
  currentEntityId: null,
  selectedUnitId: null,
  unitDetailDrawerOpen: false,
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
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
      return state;
    },
    setAllPresentationData: (state, action: PayloadAction<any>) => {
      const payload = action.payload || {};
      const {
        presentationInitResponse = null,
        presentationResponse = null,
        tabBarContentResponse = null,
        rightBarContentResponse = null,
      } = payload;

      state.presentationInitResponse = presentationInitResponse;
      state.presentationResponse = presentationResponse;
      state.tabBarContentResponse = tabBarContentResponse;
      state.rightBarContentResponse = rightBarContentResponse;
      return state;
    },
    setAllPresentationDataWithoutInit: (state, action: PayloadAction<any>) => {
      const payload = action.payload || {};
      const { presentationResponse = null, tabBarContentResponse = null } =
        payload;

      state.presentationResponse = presentationResponse;
      state.tabBarContentResponse = tabBarContentResponse;
      return state;
    },
    setPresentationInitResponse: (state, action: PayloadAction<any | null>) => {
      state.presentationInitResponse = action.payload;
      return state;
    },
    setPresentationResponse: (state, action: PayloadAction<any | null>) => {
      state.presentationResponse = action.payload;
      return state;
    },
    setTabBarContentResponse: (state, action: PayloadAction<any | null>) => {
      state.tabBarContentResponse = action.payload;
      return state;
    },
    setRightBarContentResponse: (state, action: PayloadAction<any | null>) => {
      state.rightBarContentResponse = action.payload;
      return state;
    },
    setCurrentEntityType: (state, action: PayloadAction<any | null>) => {
      state.currentEntityType = action.payload;
      return state;
    },
    setCurrentEntityId: (state, action: PayloadAction<string | null>) => {
      state.currentEntityId = action.payload;
      return state;
    },
    setSelectedUnitId: (state, action: PayloadAction<number | null>) => {
      state.selectedUnitId = action.payload;
      return state;
    },
    setUnitDetailDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.unitDetailDrawerOpen = action.payload;
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
  setDrawerOpen,
  setAllPresentationData,
  setPresentationInitResponse,
  setPresentationResponse,
  setTabBarContentResponse,
  setRightBarContentResponse,
  setAllPresentationDataWithoutInit,
  setCurrentEntityType,
  setCurrentEntityId,
  setSelectedUnitId,
  setUnitDetailDrawerOpen,
} = appSlice.actions;

export default appSlice.reducer;
