import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import axiosInstance from "@network/axiosInstance";
import { OpsApiRoutes } from "@network/OpsApiRoutes";
import { useAppSelector } from "@redux/hooks";
import {
  setAllPresentationDataWithoutInit,
  setGeneralLoading,
} from "@redux/appSlice";
import getAcceptLanguage from "@helpers/Auth/getAcceptLanguage";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";

const usePresentation = () => {
  const dispatch = useDispatch();
  const { locale, tenantId, projectSlug } = useParams<any>();
  const TenantId = decodeURIComponent(tenantId);
  const ProjectSlug = decodeURIComponent(projectSlug);
  const { presentationInitResponse } = useAppSelector(
    (state) => state.AppReducer
  );

  const hadndleChangePresentation = async (
    EntityType: EntityTypeEnum,
    EntityId: any
  ) => {
    dispatch(setGeneralLoading(true));
    const GeneralParams = {
      TenantId,
      ProjectSlug,
      ProjectId: presentationInitResponse?.projectId,
      EntityType,
      EntityId,
    };

    const headers = {
      "Accept-Language": getAcceptLanguage(locale),
    };

    const [
      PresentationResponse,
      TabBarContentResponse,
      RightBarContentResponse,
    ] = await Promise.all([
      axiosInstance.get(OpsApiRoutes.GetPresentations, {
        params: GeneralParams,
        headers,
      }),
      axiosInstance.get(OpsApiRoutes.GetPresentationTabBar, {
        params: {
          TenantId,
          ProjectSlug,
          ProjectId: presentationInitResponse?.projectId,
          EntityType: EntityTypeEnum.Project,
        },
        headers,
      }),
      axiosInstance.get(OpsApiRoutes.GetPresentationRightBar, {
        params: GeneralParams,
        headers,
      }),
    ]);

    if (
      !PresentationResponse?.data?.isSuccess ||
      !TabBarContentResponse?.data?.isSuccess ||
      !RightBarContentResponse?.data?.isSuccess
    ) {
      dispatch(setGeneralLoading(false));
      return;
    } else {
      dispatch(
        setAllPresentationDataWithoutInit({
          presentationResponse: PresentationResponse.data.data,
          tabBarContentResponse: TabBarContentResponse.data.data,
          rightBarContentResponse: RightBarContentResponse.data.data,
        })
      );
      dispatch(setGeneralLoading(false));
    }
  };

  return {
    hadndleChangePresentation,
  };
};
export default usePresentation;
