import { useEffect, useRef } from "react";
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
  setSelectedUnitId,
  setUnitDetailDrawerOpen,
} from "@redux/appSlice";
import getAcceptLanguage from "@helpers/Auth/getAcceptLanguage";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";
import queryString from "query-string";

// Global singleton flag
let hasInitialized = false;

const usePresentation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, tenantId, projectSlug } = useParams<any>();
  const TenantId = decodeURIComponent(tenantId);
  const ProjectSlug = decodeURIComponent(projectSlug);
  const {
    presentationInitResponse,
    currentEntityType,
    currentEntityId,
    selectedUnitId,
  } = useAppSelector((state) => state.AppReducer);

  const urlEntityType = searchParams.get("entityType");
  const urlEntityId = searchParams.get("entityId");
  const urlSelectedUnitId = searchParams.get("selectedUnitId");

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
    if (hasInitialized) return;
    hasInitialized = true;

    if (urlEntityType && urlEntityId) {
      const entityType = parseEntityType(urlEntityType);
      if (
        entityType !== null &&
        (currentEntityType !== entityType || currentEntityId !== urlEntityId)
      ) {
        dispatch(setCurrentEntityType(entityType));
        dispatch(setCurrentEntityId(urlEntityId));
      }
    }

    if (urlSelectedUnitId) {
      const unitId = parseInt(urlSelectedUnitId, 10);
      if (!isNaN(unitId) && selectedUnitId !== unitId) {
        dispatch(setSelectedUnitId(unitId));
        dispatch(setUnitDetailDrawerOpen(true));
      }
    }
  }, []);

  const updateUrlWithParams = (
    entityType: EntityTypeEnum,
    entityId: any,
    unitId?: number | null
  ) => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname;
      const queryParams: any = {
        entityType: entityType.toString(),
        entityId: entityId.toString(),
      };
      if (unitId) {
        queryParams.selectedUnitId = unitId.toString();
      }
      if (unitId === null) {
        delete queryParams.selectedUnitId;
      }
      const newQuery = queryString.stringify(queryParams);
      router.replace(`${currentUrl}?${newQuery}`, { scroll: false });
    }
  };

  const hadndleChangePresentation = async (
    EntityType: EntityTypeEnum,
    EntityId: any
  ) => {
    dispatch(setGeneralLoading(true));
    dispatch(setUnitDetailDrawerOpen(false));
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

    const [PresentationResponse, TabBarContentResponse] = await Promise.all([
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
    ]);

    if (
      !PresentationResponse?.data?.isSuccess ||
      !TabBarContentResponse?.data?.isSuccess
    ) {
      dispatch(setGeneralLoading(false));
      return;
    } else {
      dispatch(
        setAllPresentationDataWithoutInit({
          presentationResponse: PresentationResponse.data.data,
          tabBarContentResponse: TabBarContentResponse.data.data,
        })
      );
      dispatch(setGeneralLoading(false));
    }
  };

  const handleUnitClick = (unit: any) => {
    const blockId = unit.block?.id;
    if (blockId) {
      dispatch(setSelectedUnitId(unit.id));
      hadndleChangePresentation(EntityTypeEnum.Block, blockId);
      updateUrlWithParams(EntityTypeEnum.Block, blockId, unit.id);
      dispatch(setUnitDetailDrawerOpen(true));
    }
  };

  return {
    hadndleChangePresentation,
    handleUnitClick,
    currentEntityType,
    currentEntityId,
    selectedUnitId,
    updateUrlWithParams,
  };
};
export default usePresentation;
