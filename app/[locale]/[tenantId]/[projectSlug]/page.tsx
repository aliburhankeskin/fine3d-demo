import axiosInstance from "@network/axiosInstance";
import { OpsApiRoutes } from "@network/OpsApiRoutes";
import getAcceptLanguage from "@helpers/Auth/getAcceptLanguage";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";
import AppLayout from "@/layout/AppLayout";
import UnitDrawer from "./UnitDrawer";
import { IPresentationInitResponse } from "@/types/IPresentationInitResponse";
import { IBaseResponse } from "@/types/IBaseResponse";
import { IPresentationResponse } from "@/types/IPresentationResponse";
import CanvasWithDrawer from "./CanvasWithDrawer";
import DataProvider from "@/providers/DataProvider";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; tenantId: string; projectSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, tenantId, projectSlug } = await params;
  const searchParamsResolved = await searchParams;
  const TenantId = decodeURIComponent(tenantId);
  const ProjectSlug = decodeURIComponent(projectSlug);

  const queryEntityType = Array.isArray(searchParamsResolved?.entityType)
    ? searchParamsResolved.entityType[0]
    : searchParamsResolved?.entityType;
  const queryEntityId = Array.isArray(searchParamsResolved?.entityId)
    ? searchParamsResolved.entityId[0]
    : searchParamsResolved?.entityId;
  const querySelectedUnitId = Array.isArray(
    searchParamsResolved?.selectedUnitId
  )
    ? searchParamsResolved.selectedUnitId[0]
    : searchParamsResolved?.selectedUnitId;

  const PresentationInitResponse = await axiosInstance.get<
    IBaseResponse<IPresentationInitResponse>
  >(OpsApiRoutes.GetPresentationInit, {
    params: {
      TenantId,
      ProjectSlug,
    },
    headers: {
      "Accept-Language": getAcceptLanguage(locale),
    },
  });
  if (!PresentationInitResponse?.data?.isSuccess) {
    return <div>Error loading presentation</div>;
  }

  const initData = PresentationInitResponse?.data?.data;

  let entityType = EntityTypeEnum.Project;
  let entityId: string | number = initData?.projectId;
  let selectedUnitId: number | null = null;

  if (queryEntityType && queryEntityId) {
    const parsedEntityType = parseInt(queryEntityType, 10);
    if (
      !isNaN(parsedEntityType) &&
      Object.values(EntityTypeEnum).includes(parsedEntityType)
    ) {
      entityType = parsedEntityType as EntityTypeEnum;
      entityId = queryEntityId;
    }
  }

  if (querySelectedUnitId) {
    const parsedSelectedUnitId = parseInt(querySelectedUnitId, 10);
    if (!isNaN(parsedSelectedUnitId)) {
      selectedUnitId = parsedSelectedUnitId;
    }
  }

  const GeneralParams = {
    TenantId,
    ProjectSlug,
    ProjectId: initData?.projectId,
    EntityType: entityType,
    EntityId: entityId,
  };

  const headers = {
    "Accept-Language": getAcceptLanguage(locale),
  };

  const [PresentationResponse, TabBarContentResponse, RightBarContentResponse] =
    await Promise.all([
      axiosInstance.get<IBaseResponse<IPresentationResponse>>(
        OpsApiRoutes.GetPresentations,
        { params: GeneralParams, headers }
      ),
      axiosInstance.get(OpsApiRoutes.GetPresentationTabBar, {
        params: {
          TenantId,
          ProjectSlug,
          ProjectId: initData?.projectId,
          EntityType: EntityTypeEnum.Project,
        },
        headers,
      }),
      axiosInstance.get(OpsApiRoutes.GetPresentationRightBar, {
        params: {
          TenantId,
          ProjectSlug,
          ProjectId: initData?.projectId,
          EntityType: EntityTypeEnum.Project,
          EntityId: initData?.projectId,
        },
        headers,
      }),
    ]);

  return (
    <DataProvider
      presentationInitResponse={PresentationInitResponse?.data?.data || null}
      presentationResponse={PresentationResponse?.data?.data || null}
      tabBarContentResponse={TabBarContentResponse?.data?.data || null}
      rightBarContentResponse={RightBarContentResponse?.data?.data}
      currentEntityType={entityType}
      currentEntityId={entityId}
      selectedUnitId={selectedUnitId}
    >
      <AppLayout drawer={<UnitDrawer />}>
        <CanvasWithDrawer />
      </AppLayout>
    </DataProvider>
  );
}
