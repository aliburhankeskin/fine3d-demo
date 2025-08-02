import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import axiosInstance from "@network/axiosInstance";
import { OpsApiRoutes } from "@network/OpsApiRoutes";
import { useAppSelector } from "@redux/hooks";
import {
  setAllPresentationDataWithoutInit,
  setGeneralLoading,
  setCurrentEntityType,
  setCurrentEntityId,
} from "@redux/appSlice";
import getAcceptLanguage from "@helpers/Auth/getAcceptLanguage";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";
import queryString from "query-string";

const usePresentation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, tenantId, projectSlug } = useParams<any>();
  const TenantId = decodeURIComponent(tenantId);
  const ProjectSlug = decodeURIComponent(projectSlug);
  const { presentationInitResponse, currentEntityType, currentEntityId } =
    useAppSelector((state) => state.AppReducer);

  const urlEntityType = searchParams.get("entityType");
  const urlEntityId = searchParams.get("entityId");

  const parseEntityType = (entityTypeString: string): EntityTypeEnum | null => {
    const entityTypeNumber = parseInt(entityTypeString, 10);
    if (isNaN(entityTypeNumber)) return null;

    const entityTypeValues = Object.values(EntityTypeEnum).filter(
      (val) => typeof val === "number"
    ) as number[];
    return entityTypeValues.includes(entityTypeNumber)
      ? (entityTypeNumber as EntityTypeEnum)
      : null;
  };

  useEffect(() => {
    if (urlEntityType && urlEntityId) {
      const entityType = parseEntityType(urlEntityType);
      if (
        entityType !== null &&
        (currentEntityType !== entityType || currentEntityId !== urlEntityId)
      ) {
        dispatch(setCurrentEntityType(entityType));
        dispatch(setCurrentEntityId(urlEntityId));
      }
    } else if (currentEntityType !== null && currentEntityId) {
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname;
        const newQuery = queryString.stringify({
          entityType: currentEntityType.toString(),
          entityId: currentEntityId,
        });
        router.replace(`${currentUrl}?${newQuery}`, { scroll: false });
      }
    }
  }, [
    urlEntityType,
    urlEntityId,
    currentEntityType,
    currentEntityId,
    dispatch,
    router,
  ]);

  const updateUrlWithParams = (entityType: EntityTypeEnum, entityId: any) => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname;
      const newQuery = queryString.stringify({
        entityType: entityType.toString(),
        entityId: entityId.toString(),
      });
      router.replace(`${currentUrl}?${newQuery}`, { scroll: false });
    }
  };

  const hadndleChangePresentation = async (
    EntityType: EntityTypeEnum,
    EntityId: any
  ) => {
    dispatch(setGeneralLoading(true));
    dispatch(setCurrentEntityType(EntityType));
    dispatch(setCurrentEntityId(EntityId));
    updateUrlWithParams(EntityType, EntityId);

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
    currentEntityType,
    currentEntityId,
    updateUrlWithParams,
  };
};
export default usePresentation;
