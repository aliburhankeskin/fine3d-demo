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
}: {
  params: Promise<{ locale: string; tenantId: string; projectSlug: string }>;
}) {
  const { locale, tenantId, projectSlug } = await params;
  const TenantId = decodeURIComponent(tenantId);
  const ProjectSlug = decodeURIComponent(projectSlug);

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

  const GeneralParams = {
    TenantId,
    ProjectSlug,
    ProjectId: initData?.projectId,
    EntityType: EntityTypeEnum.Project,
    EntityId: initData?.projectId,
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
        params: GeneralParams,
        headers,
      }),
    ]);

  return (
    <DataProvider
      presentationInitResponse={PresentationInitResponse?.data?.data || null}
      presentationResponse={PresentationResponse?.data?.data || null}
      tabBarContentResponse={TabBarContentResponse?.data?.data || null}
      rightBarContentResponse={RightBarContentResponse?.data?.data}
    >
      <AppLayout drawer={<UnitDrawer />}>
        <CanvasWithDrawer />
      </AppLayout>
    </DataProvider>
  );
}
